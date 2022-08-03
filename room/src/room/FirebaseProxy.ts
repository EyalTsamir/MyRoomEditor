
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

        public getItemsCatalog(iCallback: Function) {
            let aItemsCatalogRef = this.mDB.ref("ItemsCatalog");

            aItemsCatalogRef.on("value",
                (iData) => { iCallback(iData.val()); }
            );
        }
        //________________________________________________________

        public passwordVerification(iUserName: string, iPassword: string, iIsUserExsistCallback: Function) {
            let aItemsCatalogRef = this.mDB.ref("users/" + iUserName + "/_password");

            aItemsCatalogRef.on("value",
                (iData) => { this.passwordVerificationHelper(iIsUserExsistCallback, iPassword, iData.val()); }
            );
        }
        //___________________________________________

        public passwordVerificationHelper(iIsUserExsistCallback: Function, iPassword: string, iDataVal,) {
            if (iDataVal == iPassword) {
                iIsUserExsistCallback(true)
            } else {
                iIsUserExsistCallback(false)
            }
        }
        //_________________________________________________

        public getUserData(iUserCode: string, iCallback: Function) {
            let aUserData = this.mDB.ref("users/" + iUserCode);

            aUserData.once("value",
                (iData) => {iCallback(iData.val()); }
            );
        }
        //________________________________________________________

        public updateData(iTo: string, iChild: string, iData: any) {
            let aDataRef = this.mDB.ref(iTo);
            aDataRef.child(iChild).update(iData,
                (iError) => { console.log(iError); }
            );
        }
        //____________________________________________________
        private async onGetCollabAuthId(snap) { }
        //____________________________________________________
        private async failGetCollabAuthId(error) { }
        //______________________________________



    }
}
