

namespace room {

    export class Register {

        
        private mFailRegister: HTMLElement;
        private mCallBack: Function;
        private mUserName: string;

        constructor(iCallBack: Function)
        {
            this.mCallBack = iCallBack;
            const aRegisterBotton = document.getElementById("RegisterBotton")
            aRegisterBotton.addEventListener("click", () => this.checkaRegister())
            const aMoveToLoginBotton = document.getElementById("MoveToLoginBotton")
            aMoveToLoginBotton.addEventListener("click", () => this.mCallBack())
            
            this.mFailRegister = document.getElementById("failRegister")

        }
        //______________________________________

        private checkaRegister()
        {
            this.mUserName = (document.getElementById("IdUserNameRegister") as HTMLInputElement).value;
            FireBaseProxy.instance().checkIfRegistrationCorrect(this.mUserName, (iISRegistrationCorrect: boolean) => this.Load(iISRegistrationCorrect))
           
        }
        //______________________________________

        private Load(iISRegistrationCorrect: boolean) {
            if (!iISRegistrationCorrect) {
                this.mFailRegister.style.display = "block";
            } else {
                
                this.mCallBack();

                let aObject: any = {};
                aObject.Metadata = {};
                aObject.Metadata.name = (document.getElementById("IdRoomNameRegister") as HTMLInputElement).value;
                aObject.Metadata.size = {}; 
                aObject.Metadata.size.length = (document.getElementById("IdRoomLengthRegister") as HTMLInputElement).value; // להכניס מהשדה
                aObject.Metadata.size.width = (document.getElementById("IdRoomWidthRegister") as HTMLInputElement).value; // להכניס מהשדה
                aObject.email = (document.getElementById("IdEmailRegister") as HTMLInputElement).value;
                aObject._password = (document.getElementById("IdPasswordRegister") as HTMLInputElement).value;
                FireBaseProxy.instance().sendDataToFireBase("/users", this.mUserName, aObject);
            }
        }
        //______________________________________

        private MoveToRegister() {
            let aLoginMenu = document.getElementById("login");
            aLoginMenu.style.display = "none";
            let aRegisterMenu = document.getElementById("register");
            aRegisterMenu.style.display = "block";


        }

        
        private update(aDiv: HTMLElement) {
        }

        

        
    }
}
