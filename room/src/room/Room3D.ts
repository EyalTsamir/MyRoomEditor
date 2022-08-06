namespace room {

    export class Room3D {

        protected static readonly Y_FLOOR = 0;
        protected static readonly HEIGHT = 3;
        protected static readonly WALL_WIDTH = 0.2;
        protected mCamera: THREE.PerspectiveCamera;
        protected mScene: THREE.Scene;
        //אלמנט ציור
        protected mRenderer: THREE.WebGLRenderer;

        // @ts-ignore
        protected mOrbitControls: THREE.OrbitControls;

        protected mFurnitureMesh: Array<THREE.Mesh>;
        protected mWalls: Array<THREE.Mesh>;
        protected mDiv3D: HTMLElement;
        protected mEditorManager: EditorManager;
        protected mFloor: THREE.Mesh;
        private mIsDragDropActive: boolean;
        private mCurrentlyEditing: THREE.Object3D;
        private mIsInDrag: boolean;


        constructor(iEditorManager: EditorManager) {
            this.mIsInDrag = false;
            this.mEditorManager = iEditorManager;
            //יצירת סצנה
            this.createScene();

            // יצירת קונטרולר
            this.createController();

            //אנימציה
            this.animate();
            this.mFurnitureMesh = new Array<THREE.Mesh>();
            this.mWalls = new Array<THREE.Mesh>();
            window.addEventListener('resize', () => this.onWindowResize());
        }
        //__________________________________________________________________

        private createScene() {
            this.mDiv3D = document.getElementById('3D_room');
            this.mDiv3D.onclick = (iEvent: MouseEvent) => this.onClick(iEvent);
            this.mDiv3D.onmousedown = (iEvent: MouseEvent) => this.onMouseDown(iEvent);
            this.mDiv3D.onmousemove = (iEvent: MouseEvent) => this.onMouseMove(iEvent);
            this.mDiv3D.onmouseup = (iEvent: MouseEvent) => this.onMouseUp(iEvent);

            
            this.mRenderer = new THREE.WebGLRenderer({ antialias: true });
            const aRect = this.mDiv3D.getBoundingClientRect();
            this.mRenderer.setSize(aRect.width, aRect.height);
            this.mDiv3D.appendChild(this.mRenderer.domElement);

            this.mScene = new THREE.Scene();
            this.mScene.background = new THREE.Color(0xbfe3dd);
            this.mCamera = new THREE.PerspectiveCamera(60, aRect.width / aRect.height, 1, 300);
            this.mCamera.position.set(5, 13, -8);

            const aDirectionalLight = new THREE.PointLight(0xffefbf, 1);
            aDirectionalLight.position.x = 0;
            aDirectionalLight.position.y = 8;
            aDirectionalLight.position.z = 0;
            aDirectionalLight.lookAt(0, 0, 0);
            this.mScene.add(aDirectionalLight);
        }
        //___________________________________________________________________________

        public addModel(iURL: string, iData: Furniture) {
            const aLoader = new THREE.GLTFLoader();
            aLoader.load(iURL, (iModel) => this.loadModelHelper(iModel, iData));
        }

        //___________________________________________________________________
        public deletModel(iModel: THREE.Object3D) {
            this.mScene.remove(iModel);
            iModel.traverse((iFurnitureMesh: THREE.Object3D) => this.removeAllFurnitureMesh(iFurnitureMesh))
        }
        //___________________________________________________________________________

        private removeAllFurnitureMesh(iFurnitureMesh: THREE.Object3D) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                let aIndex = this.mFurnitureMesh.indexOf(iFurnitureMesh);
                if (aIndex == -1) {
                    return;
                }
                this.mFurnitureMesh.splice(aIndex, 1);
            }
        }
        //___________________________________________________________________________

        private forAllFurnitureMesh(iFurnitureMesh: THREE.Object3D) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                this.mFurnitureMesh.push(iFurnitureMesh);
            }
        }
        //___________________________________________________________________________

        private loadModelHelper(iModel, iFurnitureData: Furniture) {
            let aModel: THREE.Object3D = iModel.scene;
            aModel.traverse((iFurnitureMesh: THREE.Object3D) => this.forAllFurnitureMesh(iFurnitureMesh))
            iFurnitureData.setModel(aModel);
            // @ts-ignore
            aModel.furnitureData = iFurnitureData;
            this.mScene.add(aModel);
            aModel.position.x = iFurnitureData.getPositionX();
            aModel.position.y = iFurnitureData.getPositionY();
            aModel.position.z = iFurnitureData.getPositionZ();
            aModel.scale.x = iFurnitureData.getScaleX();
            aModel.scale.y = iFurnitureData.getScaleY();
            aModel.scale.z = iFurnitureData.getScaleZ();
            aModel.rotateY((iFurnitureData.getRotationY() / 180) * Math.PI);
        }
        //___________________________________________________________________________

        private getFurnitureUnderMouse(iEvent: MouseEvent) {
            const raycaster = new THREE.Raycaster();
            const pointer = new THREE.Vector2();
            let aRect = this.mDiv3D.getBoundingClientRect();
            let aX = iEvent.clientX - aRect.left;
            let aY = iEvent.clientY - aRect.top;
            pointer.x = (aX / aRect.width) * 2 - 1;
            pointer.y = - (aY / aRect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, this.mCamera);
            const intersects = raycaster.intersectObjects(this.mFurnitureMesh);
            if (intersects.length > 0) {
                let aFurniture = this.getMeshFurniture(intersects[0].object);
                return aFurniture;
            }
        }
        //___________________________________________________________________________

        private onClick(iEvent: MouseEvent) {

            let aFurniture = this.getFurnitureUnderMouse(iEvent);
            this.clickOnFurniture(aFurniture);
        }
        //___________________________________________________________________________

        private getMeshFurniture(i3DObj: THREE.Object3D) {

            if (i3DObj == null) {
                return;
            }
            // @ts-ignore
            if (i3DObj.furnitureData == null) {
                return this.getMeshFurniture(i3DObj.parent)
            } else {
                return i3DObj;
            }
        }

        //___________________________________________________
        private clickOnFurniture(i3DObj: THREE.Object3D) {

            if (i3DObj == null) {
                return;
            }
            // @ts-ignore
            if (!this.mIsDragDropActive) {
                // @ts-ignore
                this.mEditorManager.openEditPanelDivEditorFanction(i3DObj.furnitureData);
                if (this.mCurrentlyEditing != null && this.mCurrentlyEditing != i3DObj) {
                    this.mCurrentlyEditing.traverse((iFurnitureMesh: THREE.Object3D) => this.changeMeshColor(iFurnitureMesh, 0xffffff))
                }
                this.mCurrentlyEditing = i3DObj;
                i3DObj.traverse((iFurnitureMesh: THREE.Object3D) => this.changeMeshColor(iFurnitureMesh, 0xff0000))
            }
        }

        

        //___________________________________________________________________________

        private onMouseDown(iEvent: MouseEvent) {
            if (this.mIsDragDropActive) {
                let aFurniture = this.getFurnitureUnderMouse(iEvent);
                if (this.mCurrentlyEditing == aFurniture) {
                    aFurniture.traverse((iFurnitureMesh: THREE.Object3D) => this.changeMeshColor(iFurnitureMesh, 0x04ff00))
                    this.mIsInDrag = true;
                    
                }
            }
        }

        private onMouseMove(iEvent: MouseEvent) {
            if (this.mCurrentlyEditing == null) {
                return;
            }
            if (this.mIsDragDropActive && this.mIsInDrag) {
                const raycaster = new THREE.Raycaster();
                const pointer = new THREE.Vector2();
                let aRect = this.mDiv3D.getBoundingClientRect();
                let aX = iEvent.clientX - aRect.left;
                let aY = iEvent.clientY - aRect.top;
                pointer.x = (aX / aRect.width) * 2 - 1;
                pointer.y = - (aY / aRect.height) * 2 + 1;
                raycaster.setFromCamera(pointer, this.mCamera);
                const intersects = raycaster.intersectObject(this.mFloor, false);
                if (intersects.length == 0) {
                    return;
                }
                let aPosX = Math.round(intersects[0].point.x * 1000) / 1000;
                let aPosZ = Math.round(intersects[0].point.z * 1000) / 1000;
                this.mCurrentlyEditing.position.x = aPosX;
                this.mCurrentlyEditing.position.z = aPosZ;
                this.mEditorManager.updatePositionValues(aPosZ, aPosX)
            }
        }

        //___________________________________________________________________________

        private onMouseUp(iEvent: MouseEvent) {
            if (this.mIsInDrag) {
                this.mIsInDrag = false;
                this.mCurrentlyEditing.traverse((iFurnitureMesh: THREE.Object3D) => this.changeMeshColor(iFurnitureMesh, 0xff0000))
            }
        }
        
        //___________________________________________________________________________

        public changeMeshColor(iFurnitureMesh: THREE.Object3D, iColor: number) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                (iFurnitureMesh.material as THREE.MeshBasicMaterial).color = new THREE.Color(iColor);
            }
        }
        //___________________________________________________________________________

        private createController() {
            // @ts-ignore
            this.mOrbitControls = new THREE.OrbitControls(this.mCamera, this.mRenderer.domElement);
            this.mOrbitControls.target.set(0, (Room3D.Y_FLOOR + Room3D.HEIGHT) / 2, 0);
            this.mOrbitControls.enablePan = false;
            this.mOrbitControls.enableDamping = true;
        }
        //___________________________________________________________________________

        public createRoom(iWidth: number, iLength: number) {
            while (this.mWalls.length > 0) {
                this.mScene.remove(this.mWalls.pop());
            }
            let aGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            let aMaterial = new THREE.MeshPhongMaterial();
            const aCube = new THREE.Mesh(aGeometry, aMaterial);
            aCube.position.x = 0;
            aCube.position.y = 0;
            aCube.position.z = 0;


            aGeometry = new THREE.BoxGeometry(iWidth, Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            this.mFloor = new THREE.Mesh(aGeometry, aMaterial);
            this.mFloor.position.y = Room3D.Y_FLOOR;

            aGeometry = new THREE.BoxGeometry(iWidth, Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            const aTop = new THREE.Mesh(aGeometry, aMaterial);
            aTop.position.y = Room3D.Y_FLOOR + Room3D.HEIGHT;

            aGeometry = new THREE.BoxGeometry(Room3D.WALL_WIDTH, Room3D.HEIGHT + Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall = new THREE.Mesh(aGeometry, aMaterial);
            aWall.position.x = iWidth / 2;
            aWall.position.y = Room3D.HEIGHT / 2;

            aGeometry = new THREE.BoxGeometry(0.2, Room3D.HEIGHT + Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall2 = new THREE.Mesh(aGeometry, aMaterial);
            aWall2.position.x = -1 * iWidth / 2;
            aWall2.position.y = Room3D.HEIGHT / 2;

            aGeometry = new THREE.BoxGeometry(iWidth + Room3D.WALL_WIDTH, Room3D.HEIGHT + Room3D.WALL_WIDTH, 0.2);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall3 = new THREE.Mesh(aGeometry, aMaterial);
            aWall3.position.z = -1 * iLength / 2;
            aWall3.position.y = Room3D.HEIGHT / 2;

            aGeometry = new THREE.BoxGeometry(iWidth + Room3D.WALL_WIDTH, Room3D.HEIGHT + Room3D.WALL_WIDTH, 0.2);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall4 = new THREE.Mesh(aGeometry, aMaterial);
            aWall4.position.z = iLength / 2;
            aWall4.position.y = Room3D.HEIGHT / 2;

            this.mWalls.push(aTop)
            this.mWalls.push(this.mFloor);
            this.mWalls.push(aWall);
            this.mWalls.push(aWall2);
            this.mWalls.push(aWall3);
            this.mWalls.push(aWall4);

            this.mScene.add(this.mFloor);
            //this.mScene.add(aTop);
            this.mScene.add(aCube);
            this.mScene.add(aWall);
            this.mScene.add(aWall2);
            this.mScene.add(aWall3);
            this.mScene.add(aWall4);



        }
        //___________________________________________________________________________

        private animate() {
            requestAnimationFrame(() => this.animate());
            this.mOrbitControls.update();
            this.mRenderer.render(this.mScene, this.mCamera);
        }
        //___________________________________________________________________________________

        private onWindowResize() {
            const aRect = this.mDiv3D.getBoundingClientRect();
            this.mRenderer.setSize(aRect.width, aRect.height);
            this.mCamera.aspect = aRect.width / aRect.height;
            this.mCamera.updateProjectionMatrix();
        }
        //___________________________________________________________________________________

        public get isDragDropActive(): boolean {
            return this.mIsDragDropActive;
        }

        public set isDragDropActive(iVal: boolean) {
            this.mOrbitControls.enabled = !iVal;
            this.mIsDragDropActive = iVal;
        }
    }

}