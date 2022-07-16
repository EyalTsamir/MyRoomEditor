namespace room {

    export class Room3D {

        protected static readonly Y_FLOOR = 0;
        protected static readonly HEIGHT = 10;
        protected static readonly WALL_WIDTH = 0.2;
        protected mCamera: THREE.PerspectiveCamera;
        protected mScene: THREE.Scene;
        //אלמנט ציור
        protected mRenderer: THREE.WebGLRenderer;

        // @ts-ignore
        protected mOrbitControls: THREE.OrbitControls;

        protected mWalls: Array<THREE.Mesh>;

        constructor() {
            //יצירת סצנה
            this.createScene();

            // יצירת קונטרולר
            this.createController(); 
            
            //אנימציה
            this.animate();

            this.mWalls = new Array<THREE.Mesh>();
        }
        //__________________________________________________________________

        private createScene() {
            const aDiv3D = document.getElementById('3D_room');
            this.mRenderer = new THREE.WebGLRenderer({ antialias: true });
            const aRect = aDiv3D.getBoundingClientRect();
            this.mRenderer.setSize(aRect.width, aRect.height);
            aDiv3D.appendChild(this.mRenderer.domElement);

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
        
        public addModel(iURL: string, iData: any) {
            const aLoader = new THREE.GLTFLoader();
            aLoader.load(iURL, (iModel) => this.loadModelHelper(iModel, iData));
        }
        //___________________________________________________________________________

        private loadModelHelper(iModel, iData: any ) {
            let aModel: THREE.Object3D = iModel.scene;
            this.mScene.add(aModel);
            aModel.position.x = iData.position.x;
            aModel.position.y = iData.position.y;
            aModel.position.z = iData.position.z;
            aModel.scale.x = iData.scale.x;
            aModel.scale.y = iData.scale.y;
            aModel.scale.z = iData.scale.z;
            aModel.rotateY((iData.rotationY/180) * Math.PI);
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
