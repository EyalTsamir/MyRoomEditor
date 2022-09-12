

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

        private addToRedo(iFurniture: Furniture) {
            iFurniture.setNext(this.mfirstRedo)
            this.mfirstRedo = iFurniture;
        }
        //__________________________________________________

        public Undo(){
            if (this.mfirstUndo != null) {
                let aToUndo = this.mfirstUndo;
                this.mfirstUndo = this.mfirstUndo.getNext();
                this.addToRedo(aToUndo);
                if (this.mFindFurnitureFunction(aToUndo.getUuId()) != null) { //יש רהיט
                    let iNew = this.mFindFurnitureFunction(aToUndo.getUuId())
                    iNew.CopyFrom(aToUndo);
                    iNew.UpdateModel();
                    this.mEditorManager.updatePanelByObject()
                    FireBaseProxy.instance().updateFurnitureData(iNew.getIndexData().toString(), aToUndo.getObject);
                } else { //אין רהיט
                    this.mEditorManager.sendFurnitureToBuild(aToUndo.getName(), this.mSidePanel.getCatalog(), aToUndo.getUuId())
                    let iNew = this.mFindFurnitureFunction(aToUndo.getUuId())
                    iNew.CopyFrom(aToUndo);
                    iNew.UpdateModel();
                    FireBaseProxy.instance().updateFurnitureData((iNew.getIndexData()).toString(), aToUndo.getObject);
                }
            }
        }

        public Redo(): Furniture {
            if (this.mfirstRedo != null) {
                let temp = this.mfirstRedo;
                this.mfirstRedo = this.mfirstRedo.getNext();
                this.addToUndo(temp.getObject(), temp.getIndexData(), temp.getUuId());
                return temp;
            }
            return null

        }


    }
}