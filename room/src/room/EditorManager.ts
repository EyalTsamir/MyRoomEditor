

namespace room {

    export class EditorManager {
        private mRoom3D: Room3D;
        private mSidePanel: SidePanel;
        private m3Dpage: HTMLElement;
        private mUserCode: string;
        private mRoomData: any;
        private mFurnitureMenu: FurnitureMenu;
        private mFurnitureNodeManager: FurnitureNodeManager;
        private mTopMenu: TopMenu;
        private mUndoRedoManager: UndoRedoManager;

        constructor(iUserCode: string) {
            this.mUserCode = iUserCode;
            this.m3Dpage = document.getElementById("3D_page");
            this.m3Dpage.style.display = "block";
            this.createSidePanel();
            this.mRoom3D = new Room3D(this);
            this.LoadRoomData();
            this.mFurnitureNodeManager = new FurnitureNodeManager();
            this.mFurnitureMenu = new FurnitureMenu(this, this.mFurnitureNodeManager);
            this.mUndoRedoManager = new UndoRedoManager(this, this.mSidePanel, (iUUID) => this.mFurnitureNodeManager.findFurnitureByUUID(iUUID));
        }
        //______________________________________



        private createSidePanel() {
            let aMainItem = document.getElementById("item");
            let aSideMenu = document.getElementById("side_menu_div");
            this.mSidePanel = new SidePanel(aMainItem, aSideMenu, this);

        }
        //______________________________________

        private LoadRoomData() {
            FireBaseProxy.instance().loadRoomData(this.mUserCode, (iData: any) => this.LoadRoomDataHelper(iData));

        }

        private LoadRoomDataHelper(iData: any) {
            this.mRoomData = iData;
            this.mTopMenu = new TopMenu(this, this.mRoomData, this.mRoom3D);
            let alength = parseFloat(this.mRoomData.Metadata.size.length);
            let aWidth = parseFloat(this.mRoomData.Metadata.size.width);
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
                if (iData[i].itemName != "Deleted") {
                    let aFurniture = this.mFurnitureNodeManager.add(iData[i], i);
                    URL = this.mSidePanel.getModelURL(iData[i].itemName)
                    this.mRoom3D.addModel(URL, aFurniture)
                }

            }
        }
        //________________________________________________________________

        public sendFurnitureToBuild(iname: string, iCatalog: any, iUUid? : string) {
            let aObject: any = {};
            aObject.itemName = iname;
            aObject.position = {};
            aObject.position.x = 0;
            aObject.position.y = 0.1;
            aObject.position.z = 0;
            aObject.rotationY = 90;
            aObject.scale = {};
            aObject.scale.x = iCatalog[iname].scale;
            aObject.scale.y = iCatalog[iname].scale;
            aObject.scale.z = iCatalog[iname].scale;
            aObject.URl = iCatalog[iname].model;

            let aFurnitureID = this.mFurnitureNodeManager.getEmptyID();
            let aNewFurniture = this.mFurnitureNodeManager.add(aObject, aFurnitureID, iUUid);
            aObject.UUID = aNewFurniture.getUuId();
            this.mRoom3D.addModel(iCatalog[iname].model, aNewFurniture)
            FireBaseProxy.instance().updateFurnitureData(aFurnitureID.toString(), aObject);
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
            FireBaseProxy.instance().updateFurnitureData(aIndex.toString(), aObj);
            this.mRoom3D.deletModel(iFurniture.getModel())
            let aToDelet = this.mFurnitureNodeManager.deleteFernicher(iFurniture);
        }
        public get isDragDropActive(): boolean {
            return this.mRoom3D.isDragDropActive;
        }
        public set isDragDropActive(iVal: boolean) {
            this.mRoom3D.isDragDropActive = iVal;
        }   
        //______________________________________________

        public updatePositionValues(iZ: number, iX: number) {
            this.mFurnitureMenu.updatePositionValues(iZ, iX)
        }
        //________________________________
        public changeMeshColor(iFurniture3DObg: THREE.Object3D, icolor: number) {
            iFurniture3DObg.traverse((iFurnitureMesh: THREE.Object3D) => this.mRoom3D.changeMeshColor(iFurnitureMesh, icolor))
        }
        //_____________________________________________________
        public updatePanelByObject() {
            this.mFurnitureMenu.updatePanelByObject()
        }        //_____________________________________________________

        public addToUndo(iFurniture: Furniture) {
            this.mUndoRedoManager.addToUndo(iFurniture.getObject(), iFurniture.getIndexData(), iFurniture.getUuId());
        }
        
        
    }
}
