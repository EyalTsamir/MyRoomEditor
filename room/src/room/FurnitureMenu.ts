

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
        private mButton: HTMLElement;




        constructor() {
            this.mPositionXInput = document.getElementById("PositionX") as HTMLInputElement
            this.mPositionYInput = document.getElementById("PositionY") as HTMLInputElement
            this.mPositionZInput = document.getElementById("PositionZ") as HTMLInputElement
            this.mRotationYInput = document.getElementById("RotationY") as HTMLInputElement
            this.mScaleXInput = document.getElementById("ScaleX") as HTMLInputElement
            this.mScaleYInput = document.getElementById("ScaleY") as HTMLInputElement
            this.mScaleZInput = document.getElementById("ScaleZ") as HTMLInputElement
            this.mEditPanelDiv = document.getElementById("Furniture_menu");
            this.mNameFurnitureDiv = document.getElementById("NameOfEditedFurniture");
            this.mButton = document.getElementById("EditButton");
            this.mButton.onclick = () => this.onclic();
        }


        public openEditPanelDiv(iFurniture: Furniture) {
            this.mFurniture = iFurniture;
            this.mEditPanelDiv.style.display = "block";
            this.mNameFurnitureDiv.innerHTML = this.mFurniture.getName();
            this.mPositionXInput.value = "" + this.mFurniture.getPositionX();
            this.mPositionYInput.value = "" + this.mFurniture.getPositionY();
            this.mPositionZInput.value = "" + this.mFurniture.getPositionZ();
            this.mRotationYInput.value = "" + this.mFurniture.getRotationY();
            this.mScaleXInput.value = "" + this.mFurniture.getPositionX();
            this.mScaleYInput.value = "" + this.mFurniture.getPositionY();
            this.mScaleZInput.value = "" + this.mFurniture.getPositionZ();


        }
        private onclic() {
            this.mFurniture.setPositionX(parseInt(this.mPositionXInput.value));
            this.mFurniture.setPositionY(parseInt(this.mPositionYInput.value));
            this.mFurniture.setPositionZ(parseInt(this.mPositionZInput.value));
            this.mFurniture.setRotationY(parseInt(this.mRotationYInput.value));
            this.mFurniture.setScaleX(parseInt(this.mScaleXInput.value));
            this.mFurniture.setScaleY(parseInt(this.mScaleYInput.value));
            this.mFurniture.setScaleZ(parseInt(this.mScaleZInput.value));
            FireBaseProxy.instance().updateData("/users/eyal1163/furniture", this.mFurniture.getIndex().toString(), this.mFurniture.getObject());

        }
    }
}