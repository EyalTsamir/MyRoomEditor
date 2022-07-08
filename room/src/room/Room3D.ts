

namespace room {

    export class Room3D {

        protected mCamera: THREE.PerspectiveCamera;
        protected mScene: THREE.Scene;

        constructor()
        {
            const container = document.getElementById('3D_room');
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            const aRect = container.getBoundingClientRect();
            renderer.setSize(aRect.width, aRect.height);
            container.appendChild(renderer.domElement);
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xbfe3dd);
            this.mCamera = new THREE.PerspectiveCamera(40, aRect.width/ aRect.height, 1, 100);
            this.mCamera.position.set(5, 2, 8);
            const controls = new (THREE as any).OrbitControls(this.mCamera, renderer.domElement);
            controls.target.set(0, 0.5, 0);
            controls.update();
            controls.enablePan = false;
            controls.enableDamping = true;

        }
        //______________________________________

        private openEditorManager() {
        }

        

        
    }
}
