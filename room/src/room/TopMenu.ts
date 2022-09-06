

namespace room {

    export class TopMenu {

        private mEditorManager: EditorManager;
        private mRoom3D: Room3D;

        private mRoomNameInput: HTMLInputElement
        private mRoomLengtInput: HTMLInputElement
        private mRoomWidthInput: HTMLInputElement
        private mLength: HTMLElement;
  


        constructor(iEditorManager: EditorManager, iRoomData: any, iRoom3D: Room3D) {
            this.mEditorManager = iEditorManager;
            this.mRoom3D = iRoom3D;

            this.mRoomNameInput = document.getElementById("IDRoomNameMenu") as HTMLInputElement
            this.mRoomLengtInput = document.getElementById("IDRoomLengtMenu") as HTMLInputElement
            this.mRoomWidthInput = document.getElementById("IDRoomWidthMenu") as HTMLInputElement

            this.mRoomNameInput.value = iRoomData.Metadata.name;
            this.mRoomLengtInput.value = iRoomData.Metadata.size.length;
            this.mRoomWidthInput.value = iRoomData.Metadata.size.width;
            this.mRoomLengtInput.onchange = () => this.cuntinusUpdate();
            this.mRoomNameInput.onchange = () => this.cuntinusUpdate();
            this.mRoomWidthInput.onchange = () => this.cuntinusUpdate();

            //setInterval(() => this.cuntinusUpdate(), 100)
        }
        //__________________________________________________________


        //__________________________________________________________

        private cuntinusUpdate() {
            let aLength = this.mRoomLengtInput.value;
            let aWidth = this.mRoomWidthInput.value;
            let aName = this.mRoomNameInput.value;
            let aObject: any = {};
            aObject.name = aName;
            aObject.size = {}
            aObject.size.length = aLength;
            aObject.size.width = aWidth;
            this.mRoom3D.createRoom(parseFloat(aWidth), parseFloat(aLength));
            FireBaseProxy.instance().updateMetaData(aObject);

            //__________________________________________________________


            //_____________________________________________________________




        }
    }
}