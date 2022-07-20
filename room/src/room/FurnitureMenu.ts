

namespace room {

    export class FurnitureMenu {


        private mFurnitureMenuNext: FurnitureMenu;
        private mInformation: FurnitureInformation;
        private mEditPanelDiv: HTMLElement; 


        constructor(iDataFurniture: any, iFather: FurnitureMenu) {
            if (iFather != null)
            {
                iFather.setNext(new FurnitureMenu(iDataFurniture, null));
            } else {
                this.mInformation = new FurnitureInformation(iDataFurniture);
            }
            if (0 == 0) { // קריאה לפתיחת חלונית העריכה (אונקליק)

            }
        }

        getNext(): FurnitureMenu {
            return this.mFurnitureMenuNext;
        }

        setNext(iFurnitureMenuNext: FurnitureMenu) {
            this.mFurnitureMenuNext = iFurnitureMenuNext;
        }

        openEditPanelDiv() {
            this.mEditPanelDiv = document.getElementById("Furniture_menu");
            let aNameDiv = document.getElementById("NameOfEditedFurniture");
            aNameDiv.innerHTML = this.mInformation.getName();

            (document.getElementById("PositionX") as HTMLInputElement).value = "" + this.mInformation.getPositionX();
            (document.getElementById("PositionY") as HTMLInputElement).value = "" + this.mInformation.getPositionY();
            (document.getElementById("PositionZ") as HTMLInputElement).value = "" + this.mInformation.getPositionZ();
            (document.getElementById("RotationY") as HTMLInputElement).value = "" + this.mInformation.getRotationY();
            (document.getElementById("ScaleX") as HTMLInputElement).value = "" + this.mInformation.getPositionX();
            (document.getElementById("ScaleY") as HTMLInputElement).value = "" + this.mInformation.getPositionY();
            (document.getElementById("ScaleZ") as HTMLInputElement).value = "" + this.mInformation.getPositionZ();
            let aaa = document.getElementById("PositionX");

        //___________________________________________________________

        //___________________________________________________________

    }
}
