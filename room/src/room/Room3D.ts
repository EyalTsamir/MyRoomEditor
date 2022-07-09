namespace room {

    export class Room3D {

        protected mCamera: THREE.PerspectiveCamera;
        protected mScene: THREE.Scene;
        protected mRenderer: THREE.WebGLRenderer;
        // @ts-ignore
        protected mOrbitControls: THREE.OrbitControls;

        protected mCube: THREE.Mesh;

        constructor() {
            this.createScene();
            this.createController();
            this.createRoom();
            this.animate();
        }
        //__________________________________________________________________

        private createScene() {
            const aContainer = document.getElementById('3D_room');
            this.mRenderer = new THREE.WebGLRenderer({ antialias: true });
            const aRect = aContainer.getBoundingClientRect();
            this.mRenderer.setSize(aRect.width, aRect.height);
            aContainer.appendChild(this.mRenderer.domElement);

            // ????? ?????
            this.mScene = new THREE.Scene();
            this.mScene.background = new THREE.Color(0xbfe3dd);
            this.mCamera = new THREE.PerspectiveCamera(60, aRect.width / aRect.height, 1, 100);
            this.mCamera.position.set(5, 2, 8);

            // ????? ??????
            const aDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
            aDirectionalLight.position.x = 40;
            aDirectionalLight.position.y = 30;
            aDirectionalLight.position.z = 20;
            aDirectionalLight.lookAt(0, 0, 0);
            this.mScene.add(aDirectionalLight);
        }
        //___________________________________________________________________________

        private createController() {
            // @ts-ignore
            this.mOrbitControls = new (THREE as any).OrbitControls(this.mCamera, this.mRenderer.domElement);
            this.mOrbitControls.target.set(0, 0.5, 0);
            this.mOrbitControls.update();
            this.mOrbitControls.enablePan = false;
            this.mOrbitControls.enableDamping = true;
        }
        //___________________________________________________________________________

        private createRoom() {
            const geometry = new THREE.BoxGeometry(3, 1, 3, 10, 10, 10);
            const material = new THREE.MeshPhongMaterial();
            this.mCube = new THREE.Mesh(geometry, material);
            this.mScene.add(this.mCube);
        }
        //___________________________________________________________________________

        private animate() {
            requestAnimationFrame(() => this.animate());
            this.mOrbitControls.update();
            this.mRenderer.render(this.mScene, this.mCamera);
        }
    }
}
