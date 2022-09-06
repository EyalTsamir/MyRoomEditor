

namespace room {

    export class FurnitureMenu {


        private mFurniture: Furniture;
        private mEditPanelDiv: HTMLElement;
        private mPositionXInput: HTMLInputElement
        private mPositionYInput: HTMLInputElement
        private mPositionZInput: HTMLInputElement
        private mRotationYInput: HTMLInputElement
        private mScaleXInput: HTMLInputElement
        private mScaleYInput: HTMLInputElement
        private mScaleZInput: HTMLInputElement
        private mNameFurnitureDiv: HTMLElement;
        private mCancelButton: HTMLElement;
        private mDeleteButton: HTMLElement;1
        private mDragDropButton: HTMLElement;
        private mEditorManager: EditorManager;
        
        



        constructor(iEditorManager: EditorManager, iFurnitureNodeManager: FurnitureNodeManager) {
            this.mEditorManager = iEditorManager;
            this.mEditorManager.isDragDropActive = false;
            this.mPositionXInput = document.getElementById("PositionX") as HTMLInputElement
            this.mPositionYInput = document.getElementById("PositionY") as HTMLInputElement
            this.mPositionZInput = document.getElementById("PositionZ") as HTMLInputElement
            this.mRotationYInput = document.getElementById("RotationY") as HTMLInputElement
            this.mScaleXInput = document.getElementById("ScaleX") as HTMLInputElement
            this.mScaleYInput = document.getElementById("ScaleY") as HTMLInputElement
            this.mScaleZInput = document.getElementById("ScaleZ") as HTMLInputElement
            this.mEditPanelDiv = document.getElementById("Furniture_menu");
            this.mNameFurnitureDiv = document.getElementById("NameOfEditedFurniture");
            this.mCancelButton = document.getElementById("CancelButton");
            this.mDeleteButton = document.getElementById("DeleteButton")
            this.mDragDropButton = document.getElementById("DragDrop")
            this.mDragDropButton.onclick = () => this.onDragDrop();
            this.mCancelButton.onclick = () => this.onClose();
            this.mDeleteButton.onclick = () => this.deleteFernicher();
            setInterval(() => this.cuntinusUpdate(), 100)

        }
        //__________________________________________________________

        public openEditPanelDiv(iFurniture: Furniture) {
            this.mFurniture = iFurniture;
            this.mEditPanelDiv.style.display = "block";
            this.mNameFurnitureDiv.innerHTML = this.mFurniture.getName();
            this.mPositionXInput.value = "" + this.mFurniture.getPositionX();
            this.mPositionYInput.value = "" + this.mFurniture.getPositionY();
            this.mPositionZInput.value = "" + this.mFurniture.getPositionZ();
            this.mRotationYInput.value = "" + this.mFurniture.getRotationY();
            this.mScaleXInput.value = "" + this.mFurniture.getScaleX() * 100;
            this.mScaleYInput.value = "" + this.mFurniture.getScaleY() * 100;
            this.mScaleZInput.value = "" + this.mFurniture.getScaleZ() * 100;

        }
       //__________________________________________________________

        private cuntinusUpdate() {
            if (this.mFurniture == null) {
                return
            }
            let aObject: any = {};
            aObject.itemName = this.mFurniture.getName();
            aObject.position = {};
            if (parseFloat(this.mPositionYInput.value) < 0.1) {
                this.mPositionYInput.value = "0.1";
            }
            aObject.position.x = parseFloat(this.mPositionXInput.value);
            aObject.position.y = parseFloat(this.mPositionYInput.value);
            aObject.position.z = parseFloat(this.mPositionZInput.value);
            aObject.rotationY = parseFloat(this.mRotationYInput.value);
            aObject.scale = {};
            if (parseFloat(this.mScaleXInput.value) < 0.1) {
                this.mScaleXInput.value = "0.1";
            }
            if (parseFloat(this.mScaleYInput.value) < 0.1) {
                this.mScaleYInput.value = "0.1";
            }
            if (parseFloat(this.mScaleZInput.value) < 0.1) {
                this.mScaleZInput.value = "0.1";
            }
            aObject.scale.x = parseFloat(this.mScaleXInput.value) / 100;
            aObject.scale.y = parseFloat(this.mScaleYInput.value) / 100;
            aObject.scale.z = parseFloat(this.mScaleZInput.value) / 100;
            let aTempFurniture = new Furniture(aObject, this.mFurniture.getIndexData())
            if (this.mFurniture.isEqualParameter(aTempFurniture)) {
                return
            }
            this.mFurniture.CopyFrom(aTempFurniture);
            FireBaseProxy.instance().updateFurnitureData(this.mFurniture.getIndexData().toString(), this.mFurniture.getObject());
            this.mFurniture.UpdateModel();
        }
         //__________________________________________________________


        public updatePositionValues(iZ: number, iX :number) {
            this.mPositionXInput.value = "" + iX;
            this.mPositionZInput.value = "" + iZ;
            
        }
        //_____________________________________________________________

        private onClose() {
            this.mEditPanelDiv.style.display = "none";
            this.mEditorManager.isDragDropActive = false;
            this.mEditorManager.changeMeshColor(this.mFurniture.getModel(), 0xffffff)
        }
        private onDragDrop() {

            if (!this.mEditorManager.isDragDropActive) {
                this.mEditorManager.isDragDropActive = true;
                this.mDragDropButton.style.backgroundColor = "green";
            } else {
                this.mEditorManager.isDragDropActive = false;
                this.mDragDropButton.style.backgroundColor = "white";
            }
        }
        
        private deleteFernicher() {
            this.mEditPanelDiv.style.display = "none";
            this.mEditorManager.deleteFernicher(this.mFurniture);
        }
    }
}