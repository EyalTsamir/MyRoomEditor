

namespace room {

    export class EditorManager {
        private mRoom3D: Room3D;
        private mSidePanel: SidePanel;
        private m3Dpage: HTMLElement;
        private mUserCode: string;
        private mRoomData: any;
        private mFurnitureMenu: FurnitureMenu;
        private mFurnitureNodeManager: FurnitureNodeManager;

        constructor(iUserCode: string) {
            this.mUserCode = iUserCode;
            this.m3Dpage = document.getElementById("3D_page");
            this.m3Dpage.style.display = "block";
            this.createSidePanel();
            this.mRoom3D = new Room3D(this);
            this.LoadRoomData();
            this.mFurnitureNodeManager = new FurnitureNodeManager();
            this.mFurnitureMenu = new FurnitureMenu(this, this.mFurnitureNodeManager);
            this.mFurnitureNodeManager = new FurnitureNodeManager();
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
        //________________________________________________________________

        private buildRoomFurniture(iData: Array<any>) {
            let URL: string;
            for (var i = 0; i < iData.length; i++) {
                let aFurniture = this.mFurnitureNodeManager.add(iData[i], i);
                if (iData[i].itemName != "Deleted") {
                    URL = this.mSidePanel.getModelURL(iData[i].itemName)
                    this.mRoom3D.addModel(URL, aFurniture)
                }

            }
        }
        //________________________________________________________________

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
            let aFurnitureIndex = this.mFurnitureNodeManager.getNumOfFurniture();
            let aNewFurniture = this.mFurnitureNodeManager.add(aObject, aFurnitureIndex);
            this.mRoom3D.addModel(iCatalog[iname].model, aNewFurniture)
            FireBaseProxy.instance().updateData("/users/eyal1163/furniture", aFurnitureIndex.toString(), aObject);
        }
        //_____________________________________________________________________


        /////   need fixing
        public openEditPanelDivEditorFanction(iFurniture: Furniture) {
            this.mFurnitureMenu.openEditPanelDiv(iFurniture);
        }

        public deleteFernicher(iFurniture: Furniture) {
            let aIndex = iFurniture.getIndexData();
            iFurniture.setName("Deleted")
            let aObj = iFurniture.getObject();
            FireBaseProxy.instance().updateData("/users/eyal1163/furniture", aIndex.toString(), aObj);
            //* let aToDelet = this.mFurnitureNodeManager.deleteFernicher(iFurniture);
            this.mRoom3D.deletModel(iFurniture.getModel())

        }
    }
}
