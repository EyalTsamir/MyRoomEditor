

namespace room {

    export class Main {

        private mEditorManager: EditorManager;
        public mLogin: Login;


        constructor()
        {
            this.createLogin();
            FireBaseProxy.instance();
            
            
        }
        //______________________________________

        private createLogin() {
            let aLoginMenu = document.getElementById("login_and_register");
            this.mLogin = new Login(aLoginMenu, (iUserCode: string) => this.openEditorManager(iUserCode));
        }
        //__________________________________________

        private openEditorManager(iUserCode:string) {
            this.mEditorManager = new EditorManager(iUserCode);
        }

        

        
    }
}
