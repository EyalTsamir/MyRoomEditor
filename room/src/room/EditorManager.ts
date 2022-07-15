

namespace room {

    export class EditorManager {
        private mRoom3D: Room3D;
        private mSidePanel: SidePanel;
        private m3Dpage: HTMLElement;
        private mUserCode: string;
        private mRoomData: any;

        constructor(iUserCode: string)
        {
            this.mUserCode = iUserCode;
            this.m3Dpage = document.getElementById("3D_page");
            this.m3Dpage.style.display = "block";
            this.createSidePanel();
            this.mRoom3D = new Room3D();
            this.getRoomData();

        }
        //______________________________________

        

        private createSidePanel()
        {
            let aMainItem = document.getElementById("item");
            let aSideMenu = document.getElementById("side_menu_div");
            this.mSidePanel = new SidePanel(aMainItem, aSideMenu);
           
        }
        //______________________________________

        private getRoomData() {
            FireBaseProxy.instance().getUserData(this.mUserCode, (iData: any) => this.readRoomData(iData));
        }

        private readRoomData(iData:any) {
            this.mRoomData = iData;
            let alength = this.mRoomData.Metadata.size.length
            let aWidth = this.mRoomData.Metadata.size.width
            this.mRoom3D.createRoom(aWidth, alength);

        }



        
        
        
    }
}
