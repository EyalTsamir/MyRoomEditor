

namespace room {

    export class UndoRedoManager {
        private mfirstUndo: Furniture;
        private mfirstRedo: Furniture;
        private UndoButton: HTMLElement;
        private RedoButton: HTMLElement;
        private mFindFurnitureFunction: Function;
        private mEditorManager: EditorManager;
        private mSidePanel: SidePanel;




        constructor(iEditorManager: EditorManager, iSidePanel: SidePanel, iFindFurnitureFunction: Function) {
            this.mfirstUndo = null;
            this.mfirstUndo = null;
            this.UndoButton = document.getElementById("UndoButton");
            this.UndoButton.onclick = () => this.Undo();
            this.RedoButton = document.getElementById("RedoButton");
            this.RedoButton.onclick = () => this.Redo();
            this.mFindFurnitureFunction = iFindFurnitureFunction;
            this.mEditorManager = iEditorManager;
            this.mSidePanel = iSidePanel;


        }

        //___________________________________________________________

        public addToUndo(iFurnitureData: any, iFurnitureID: number, iUUID : string) {
            let aFurniture: Furniture = new Furniture(iFurnitureData, iFurnitureID, iUUID);
            aFurniture.setNext(this.mfirstUndo)
            this.mfirstUndo = aFurniture;


        }
        //___________________________________________________________

        private addToRedo(iFurnitureData: any, iFurnitureID: number, iUUID: string) {
            let aFurniture: Furniture = new Furniture(iFurnitureData, iFurnitureID, iUUID);
            aFurniture.setNext(this.mfirstRedo)
            this.mfirstRedo = aFurniture;

        }
        //__________________________________________________

        public Undo(){
            if (this.mfirstUndo != null) {
                let aToUndo = this.mfirstUndo;
                this.mfirstUndo = this.mfirstUndo.getNext();
                this.addToRedo(aToUndo.getObject(), aToUndo.getIndexData(), aToUndo.getUuId());
                if (this.mFindFurnitureFunction(aToUndo.getUuId()) != null) { //יש רהיט
                    let iNew = this.mFindFurnitureFunction(aToUndo.getUuId())
                    iNew.CopyFrom(aToUndo);
                    iNew.UpdateModel();
                    this.mEditorManager.updatePanelByObject()
                    FireBaseProxy.instance().updateFurnitureData(iNew.getIndexData().toString(), aToUndo.getObject());
                } else { //אין רהיט
                    this.mEditorManager.sendFurnitureToBuild(aToUndo.getName(), this.mSidePanel.getCatalog(), aToUndo.getUuId())
                    let iNew = this.mFindFurnitureFunction(aToUndo.getUuId())
                    iNew.CopyFrom(aToUndo);
                    iNew.UpdateModel();
                    FireBaseProxy.instance().updateFurnitureData((iNew.getIndexData()).toString(), aToUndo.getObject());
                }
            }
        }

        public Redo() {
            if (this.mfirstRedo != null) {
                let aToRedo = this.mfirstRedo;
                this.mfirstRedo = this.mfirstRedo.getNext();
                this.addToUndo(aToRedo.getObject(), aToRedo.getIndexData(), aToRedo.getUuId());
                if (this.mFindFurnitureFunction(aToRedo.getUuId()) != null) { //יש רהיט
                    let iNew = this.mFindFurnitureFunction(aToRedo.getUuId())
                    iNew.CopyFrom(aToRedo);
                    iNew.UpdateModel();
                    this.mEditorManager.updatePanelByObject()
                    FireBaseProxy.instance().updateFurnitureData(iNew.getIndexData().toString(), aToRedo.getObject());
                } else { //אין רהיט
                    this.mEditorManager.sendFurnitureToBuild(aToRedo.getName(), this.mSidePanel.getCatalog(), aToRedo.getUuId())
                    let iNew = this.mFindFurnitureFunction(aToRedo.getUuId())
                    iNew.CopyFrom(aToRedo);
                    iNew.UpdateModel();
                    FireBaseProxy.instance().updateFurnitureData((iNew.getIndexData()).toString(), aToRedo.getObject());
                }
            
            }

        }


    }
}