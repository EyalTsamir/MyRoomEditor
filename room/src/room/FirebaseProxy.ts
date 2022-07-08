
declare var firebase;

module room {

    export class FireBaseProxy {

        private mConfig: any;

        constructor() {

            this.mConfig = {
                apiKey: "AIzaSyDWGr8iYh7Lqqsv5LXGa57I43CBKB-oemM",
                authDomain: "myroom-4bc57.firebaseapp.com",
                projectId: "myroom-4bc57",
                //storageBucket: "myroom-4bc57.appspot.com",
                //messagingSenderId: "320998764719",
                appId: "1:320998764719:web:571465031889b61481645a",
                //measurementId: "G-NBMJ3DJB20"
            };
            this.initFireBase();
        }
        //____________________________________________________
        private async initFireBase() {
            this.mConfig.databaseURL = "https://myroom-4bc57-default-rtdb.firebaseio.com";
            const aApp = firebase.initializeApp(this.mConfig);
            await aApp.auth().signInAnonymously().then((snap: any) => this.onGetCollabAuthId(snap)).catch((error) => this.failGetCollabAuthId(error));
            let aDB = firebase.database(aApp);
            let aConnectedRef = aDB.ref("users");
            aConnectedRef.on("value", (snap) => {
                    console.log(snap.val())
            });
        }
        //____________________________________________________
        private async onGetCollabAuthId(snap) {
            //console.log(snap);
        }
        //____________________________________________________
        private async failGetCollabAuthId(error) {
            console.log(error);
        }
        //______________________________________



    }
}
