

namespace room {

    export class Main {

        private mEditorManager: EditorManager;

        constructor()
        {
            FireBaseProxy.instance();
            new Room3D();
            setTimeout(() => this.openEditorManager(), 1000);
        }
        //______________________________________

        private openEditorManager() {
            this.mEditorManager = new EditorManager();
        }

        

        
    }
}
