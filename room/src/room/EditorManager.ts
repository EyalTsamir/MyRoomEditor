

namespace room {

    export class EditorManager {
        private mRoom3D: Room3D;
        private mSidePanel: SidePanel;
        private m3Dpage: HTMLElement;
        private mUserCode: string;
        private mRoomData: any;
        private mFurnitureMenu: FurnitureMenu;
        private mFurniture: Furniture;

        constructor(iUserCode: string) {
            this.mUserCode = iUserCode;
            this.m3Dpage = document.getElementById("3D_page");
            this.m3Dpage.style.display = "block";
            this.createSidePanel();
            this.mRoom3D = new Room3D();
            this.LoadRoomData();
            this.mFurnitureMenu = new FurnitureMenu();

        }
        //______________________________________



        private createSidePanel() {
            let aMainItem = document.getElementById("item");
            let aSideMenu = document.getElementById("side_menu_div");
            this.mSidePanel = new SidePanel(aMainItem, aSideMenu, this);

        }
        //______________________________________

        private LoadRoomData() {
            FireBaseProxy.instance().getUserData(this.mUserCode, (iData: any) => this.LoadRoomDataHelper(iData));

        }

        private LoadRoomDataHelper(iData: any) {
            this.mRoomData = iData;
            let alength = this.mRoomData.Metadata.size.length
            let aWidth = this.mRoomData.Metadata.size.width
            this.mRoom3D.createRoom(aWidth, alength);
            if (this.mRoomData.furniture == null) {
                this.mRoomData.furniture = new Array<any>();
            }
            this.buildRoomFurniture(this.mRoomData.furniture);
        }

        private buildRoomFurniture(iData: Array<any>) {
            let URL: string;
            for (var i = 0; i < iData.length; i++) {
                URL = this.mSidePanel.getModelURL(iData[i].itemName)
                let aFurniture = this.addFurnitureToList(iData[i]);
                this.mRoom3D.addModel(URL, aFurniture)
            }
        }

        public sendFurnitureToBuild(iname: string, iCatalog: any) {
            let aObject: any = {};
            aObject.itemName = iname;
            aObject.position = {};
            aObject.position.x = 0;
            aObject.position.y = 0;
            aObject.position.z = 0;
            aObject.rotationY = 90;
            aObject.scale = {};
            aObject.scale.x = iCatalog[iname].scale;
            aObject.scale.y = iCatalog[iname].scale;
            aObject.scale.z = iCatalog[iname].scale;
            this.addFurnitureToList(aObject)
            let aNum: number = this.mRoomData.furniture.length;
            FireBaseProxy.instance().updateData("/users/eyal1163/furniture", aNum.toString(), aObject);




        }

        private addFurnitureToList(iData): Furniture {
            if (this.mFurniture == null) {
                this.mFurniture = new Furniture(iData);
                return this.mFurniture;
            } else {
                let aFurniture: Furniture = this.mFurniture;
                while (aFurniture.getNext() != null) {
                    aFurniture = aFurniture.getNext();
                }
                aFurniture.setNext(new Furniture(iData));
                return aFurniture;
            }
        }
    }
}
