namespace room {

    export class Room3D {

        protected static readonly Y_FLOOR = 0;
        protected static readonly HEIGHT = 3;
        protected static readonly WALL_WIDTH = 0.2;
        protected mCamera: THREE.PerspectiveCamera;
        protected mScene: THREE.Scene;
        //����� ����
        protected mRenderer: THREE.WebGLRenderer;

        // @ts-ignore
        protected mOrbitControls: THREE.OrbitControls;

        protected mFurnitureMesh: Array<THREE.Mesh>;
        protected mWalls: Array<THREE.Mesh>;
        protected mDiv3D: HTMLElement;
        protected mEditorManager: EditorManager;

        constructor(iEditorManager: EditorManager) {
            this.mEditorManager = iEditorManager;
            //����� ����
            this.createScene();

            // ����� ��������
            this.createController(); 
            
            //�������
            this.animate();
            this.mFurnitureMesh = new Array<THREE.Mesh>();
            this.mWalls = new Array<THREE.Mesh>();
        }
        //__________________________________________________________________

        private createScene() {
            this.mDiv3D = document.getElementById('3D_room');
            this.mDiv3D.onclick = (iEvent: MouseEvent) => this.onClick(iEvent);
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
        }

        //___________________________________________________________________________

        private forAllFurnitureMesh(iFurnitureMesh: THREE.Object3D) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                this.mFurnitureMesh.push(iFurnitureMesh);
            }
        }
        //___________________________________________________________________________

        private loadModelHelper(iModel, iFurnitureData: Furniture ) {
            let aModel: THREE.Object3D = iModel.scene;
            aModel.traverse((iMesh: THREE.Object3D) => this.forAllFurnitureMesh(iMesh))
            iFurnitureData.setModel(aModel);
             // @ts-ignore
            aModel.furnitureData = iFurnitureData;
            this.mScene.add(aModel);
            aModel.position.x = iFurnitureData.getPositionX();
            aModel.position.y = iFurnitureData.getPositionX();
            aModel.position.z = iFurnitureData.getPositionX();
            aModel.scale.x = iFurnitureData.getScaleX();
            aModel.scale.y = iFurnitureData.getScaleY();
            aModel.scale.z = iFurnitureData.getScaleZ();
            aModel.rotateY((iFurnitureData.getRotationY()/180) * Math.PI);
        }
        //___________________________________________________________________________

        private onClick(iEvent: MouseEvent) {
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
                this.clickOnFurniture(intersects[0].object);
            }
        }
        //___________________________________________________________________________

        private clickOnFurniture(i3DObj: THREE.Object3D) {
            
            if (i3DObj == null) {
                return;
            }
            // @ts-ignore
            if (i3DObj.furnitureData == null) {
                this.clickOnFurniture(i3DObj.parent)
            } else {
                // @ts-ignore
                this.mEditorManager.openEditPanelDivEditorFanction(i3DObj.furnitureData);
            }
        }
        //___________________________________________________________________________

        private createController() {
            // @ts-ignore
            this.mOrbitControls = new THREE.OrbitControls(this.mCamera, this.mRenderer.domElement);
            this.mOrbitControls.target.set(0, (Room3D.Y_FLOOR + Room3D.HEIGHT)/2, 0);
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
            const afloor = new THREE.Mesh(aGeometry, aMaterial);
            afloor.position.y = Room3D.Y_FLOOR;

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
            this.mWalls.push(afloor);
            this.mWalls.push(aWall);
            this.mWalls.push(aWall2);
            this.mWalls.push(aWall3);
            this.mWalls.push(aWall4);

            this.mScene.add(afloor);
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
    }
}
