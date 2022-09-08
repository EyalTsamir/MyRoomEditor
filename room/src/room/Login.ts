

namespace room {

    export class Login {

        private mLoginMenuDiv: HTMLElement;
        private mFailLogin: HTMLElement;
        private mCallBack: Function;
        private mUserName: string;
        private mRegisterDiv: HTMLElement;


        constructor(iLoginMenu: HTMLElement, iCallBack: Function)
        {
            this.mCallBack = iCallBack;
            this.mLoginMenuDiv = iLoginMenu;
            const aLoginBotton = document.getElementById("loginBotton")
            aLoginBotton.addEventListener("click", () => this.checkLogin())
            const aMoveToRegisterButton = document.getElementById("MoveToRegisterButton")
            aMoveToRegisterButton.addEventListener("click", () => this.MoveToRegister())
            this.mFailLogin = document.getElementById("failLogin")
            this.mRegisterDiv = document.getElementById("register");

        }
        //______________________________________

        private checkLogin()
        {
            this.mUserName = (document.getElementById("IdUserName") as HTMLInputElement).value;
            let aPassword = (document.getElementById("Idpassword") as HTMLInputElement).value;
            FireBaseProxy.instance().checkIfUserExsit(this.mUserName, aPassword, (UserCode: any) => this.Load(UserCode))
           
        }
        //______________________________________

        private Load(isLoginSuccess: boolean) {
            if (isLoginSuccess) {
                this.mLoginMenuDiv.style.display = "none";
                this.mCallBack(this.mUserName)
            } else {
                this.mFailLogin.style.display = "block";
            }
        }
        //______________________________________

        private MoveToRegister() {
            let aLoginMenu = document.getElementById("login");
            aLoginMenu.style.display = "none";
            let aRegisterMenu = document.getElementById("register");
            aRegisterMenu.style.display = "block";
            const aFailRegister = document.getElementById("failRegister")
            aFailRegister.style.display = "none";
            let aRegister = new Register(() => this.FinishRegister());
            let aLoginAndRegisterDiv = document.getElementById("login_and_register");
            aLoginAndRegisterDiv.style.backgroundColor = "aliceblue";


            

        }


        private FinishRegister() {
            this.mLoginMenuDiv.style.display = "block";
            this.mRegisterDiv.style.display = "none";
            let aLoginAndRegisterDiv = document.getElementById("login_and_register");
            aLoginAndRegisterDiv.style.backgroundColor = "cornsilk";
            let afailLoginDiv = document.getElementById("failLogin");
            afailLoginDiv.style.display = "none";


        }

        
        private update(aDiv: HTMLElement) {
        }

        

        
    }
}
