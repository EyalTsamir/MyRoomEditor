

namespace room {

    export class Login {

        private mLoginMenuDiv: HTMLElement;
        private mFailLogin: HTMLElement;
        private mCallBack: Function;
        private mUserName: string;

        constructor(iLoginMenu: HTMLElement, iCallBack: Function)
        {
            this.mCallBack = iCallBack;
            this.mLoginMenuDiv = iLoginMenu;
            const aLoginBotton = document.getElementById("loginBotton")
            aLoginBotton.addEventListener("click", () => this.checkLogin())
            this.mFailLogin = document.getElementById("failLogin")

        }
        //______________________________________

        private checkLogin()
        {
            this.mUserName = (document.getElementById("IdUserName") as HTMLInputElement).value;
            let aPassword = (document.getElementById("Idpassword") as HTMLInputElement).value;
            FireBaseProxy.instance().passwordVerification(this.mUserName, aPassword, (UserCode: any) => this.Load(UserCode))
           
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


        private update(aDiv: HTMLElement) {
        }

        

        
    }
}
