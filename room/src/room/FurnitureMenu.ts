

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
        private mEditButton: HTMLElement;
        private mCancelButton: HTMLElement;
        private mDeleteButton: HTMLElement;
        private mEditorManager: EditorManager;
        




        constructor(iEditorManager: EditorManager, iFurnitureNodeManager: FurnitureNodeManager) {
            this.mEditorManager = iEditorManager;
            this.mPositionXInput = document.getElementById("PositionX") as HTMLInputElement
            this.mPositionYInput = document.getElementById("PositionY") as HTMLInputElement
            this.mPositionZInput = document.getElementById("PositionZ") as HTMLInputElement
            this.mRotationYInput = document.getElementById("RotationY") as HTMLInputElement
            this.mScaleXInput = document.getElementById("ScaleX") as HTMLInputElement
            this.mScaleYInput = document.getElementById("ScaleY") as HTMLInputElement
            this.mScaleZInput = document.getElementById("ScaleZ") as HTMLInputElement
            this.mEditPanelDiv = document.getElementById("Furniture_menu");
            this.mNameFurnitureDiv = document.getElementById("NameOfEditedFurniture");
            this.mEditButton = document.getElementById("EditButton");
            this.mEditButton.onclick = () => this.onclic();
            this.mCancelButton = document.getElementById("CancelButton");
            this.mCancelButton = document.getElementById("CancelButton");
            this.mDeleteButton = document.getElementById("DeleteButton")
            this.mCancelButton.onclick = () => this.onClose();
            this.mDeleteButton.onclick = () => this.deleteFernicher();
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

        private onclic() {
            this.mFurniture.setPositionX(parseFloat(this.mPositionXInput.value));
            this.mFurniture.setPositionY(parseFloat(this.mPositionYInput.value));
            this.mFurniture.setPositionZ(parseFloat(this.mPositionZInput.value));
            this.mFurniture.setRotationY(parseFloat(this.mRotationYInput.value));
            this.mFurniture.setScaleX(parseFloat(this.mScaleXInput.value) / 100);
            this.mFurniture.setScaleY(parseFloat(this.mScaleYInput.value) / 100);
            this.mFurniture.setScaleZ(parseFloat(this.mScaleZInput.value) / 100);
            this.mEditPanelDiv.style.display = "none";
            FireBaseProxy.instance().updateData("/users/eyal1163/furniture", this.mFurniture.getIndexData().toString(), this.mFurniture.getObject());
            this.mFurniture.UpdateModel();
        }
         //__________________________________________________________

        private onClose() {
            this.mEditPanelDiv.style.display = "none";
        }
        private deleteFernicher() {
            this.mEditPanelDiv.style.display = "none";
            this.mEditorManager.deleteFernicher(this.mFurniture);
        }
    }
}