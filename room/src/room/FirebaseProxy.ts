
declare var firebase;

module room {

    export class FireBaseProxy {

        private static mFireBaseProxy: FireBaseProxy;

        public static instance(): FireBaseProxy {
            if (FireBaseProxy.mFireBaseProxy == null) {
                FireBaseProxy.mFireBaseProxy = new FireBaseProxy();
            }
            return FireBaseProxy.mFireBaseProxy;
        }
        //____________________________________________________

        private mConfig: any
        private mDB: any;
        private mUpdateFireBaseTimeOut: number;
        private mUserName: string;
        private constructor() {

            this.mConfig = {
                apiKey: "AIzaSyDWGr8iYh7Lqqsv5LXGa57I43CBKB-oemM",
                authDomain: "myroom-4bc57.firebaseapp.com",
                projectId: "myroom-4bc57",
                appId: "1:320998764719:web:571465031889b61481645a",
            };
            this.connectFireBase();
        }
        //____________________________________________________

        private async connectFireBase() {
            this.mConfig.databaseURL = "https://myroom-4bc57-default-rtdb.firebaseio.com";
            const aApp = firebase.initializeApp(this.mConfig);
            await aApp.auth().signInAnonymously().then((snap: any) => this.onGetCollabAuthId(snap)).catch((error) => this.failGetCollabAuthId(error));
            this.mDB = firebase.database(aApp);
        }
        //________________________________________________________

        public loadFurnitureList(iCallback: Function) {
            let aItemsCatalogRef = this.mDB.ref("ItemsCatalog");

            aItemsCatalogRef.on("value",
                (iData) => { iCallback(iData.val()); }
            );
        }
        //________________________________________________________

        public checkIfUserExsit(iUserName: string, iPassword: string, iIsUserExsistCallback: Function) {
            let aItemsCatalogRef = this.mDB.ref("users/" + iUserName + "/_password");

            aItemsCatalogRef.on("value",
                (iData) => {
                    this.passwordVerificationHelper(iIsUserExsistCallback, iPassword, iData.val(), iUserName);
                }
            );
        }
        //___________________________________________
        public passwordVerificationHelper(iIsUserExsistCallback: Function, iPassword: string, iDataVal, iUserName) {
            if (iDataVal == iPassword) {
                this.mUserName = iUserName;
                iIsUserExsistCallback(true)
            } else {
                iIsUserExsistCallback(false)
            }
        }
        //_________________________________________________
        public checkIfRegistrationCorrect(iUserName: string, iIsRegistrationCorrect: Function) {
            let aItemsCatalogRef = this.mDB.ref("users/" + iUserName + "/_password"); //�����: �� �� �� ����� ����� ���� 
            aItemsCatalogRef.on("value",
                (iData) => {
                    this.checkIfRegistrationCorrectHelper (iIsRegistrationCorrect, iData.val());
                }
            );
        }

        public checkIfRegistrationCorrectHelper(iIsRegistrationCorrectCallback: Function, iDataVal,) { // ���� ���� ����� ��� �� ��� ����� ��� ���
            if (iDataVal == null) {
                iIsRegistrationCorrectCallback(true)
            } else {
                iIsRegistrationCorrectCallback(false)
            }
        }
        //___________________________________________


        public loadRoomData(iUserCode: string, iCallback: Function) {
            let aUserData = this.mDB.ref("users/" + iUserCode);

            aUserData.once("value",
                (iData) => { iCallback(iData.val()); }
            );
        }
        //________________________________________________________

        public sendDataToFireBase(iTo: string, iChild: string, iData: any) {
            let aDataRef = this.mDB.ref(iTo);
            aDataRef.child(iChild).update(iData,
                (iError) => { console.log(iError); }
            );
        }

        //________________________________________________________
        public updateFurnitureData(iID: string, iData: any,) {
            clearTimeout(this.mUpdateFireBaseTimeOut);
            this.mUpdateFireBaseTimeOut = setTimeout(() => this.sendDataToFireBase("/users/" + this.mUserName + "/furniture", iID, iData), 100);

        }

        public updateMetaData(iData: any) {
            this.sendDataToFireBase("/users/" + this.mUserName, "Metadata", iData);
        }
        


        //____________________________________________________
        private async onGetCollabAuthId(snap) { }
        //____________________________________________________
        private async failGetCollabAuthId(error) { }
        //______________________________________



    }
}
