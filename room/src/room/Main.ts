

namespace room {

    export class Main {

        private mEditorManager: EditorManager;

        constructor()
        {
            FireBaseProxy.instance();
            setTimeout(() => this.openEditorManager(), 2000);
        }
        //______________________________________

        private openEditorManager() {
            this.mEditorManager = new EditorManager();
        }

        

        
    }
}
