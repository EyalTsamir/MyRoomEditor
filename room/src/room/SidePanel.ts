

namespace room {

    export class SidePanel {


        private mItemDiv: HTMLElement;
        private mSideMenuDiv: HTMLElement;
        private mCatalog: any;



        constructor(iItemDiv: HTMLElement, iSideMenuDiv: HTMLElement) {
            this.mItemDiv = iItemDiv;
            this.mSideMenuDiv = iSideMenuDiv;
            this.mSideMenuDiv.removeChild(this.mItemDiv);
            FireBaseProxy.instance().getItemsCatalog((iItemsData: any) => this.buildSidePanel(iItemsData))
        }
        //___________________________________________________________

        private buildSidePanel(iItemsData: any) {
            this.mCatalog = iItemsData;
            const SPACE = 120;
            let aTop = 5;
            let aItem = this.mItemDiv.cloneNode(true) as HTMLElement;
            for (let key in iItemsData) {
                aItem = this.mItemDiv.cloneNode(true) as HTMLElement;
                let aLabels = aItem.getElementsByTagName("label");
                let aImgs = aItem.getElementsByTagName("img");
                aImgs[0].src = iItemsData[key].Thumbnails;
                aLabels[0].innerHTML = iItemsData[key].name;
                aItem.style.top = aTop + "px";
                this.mSideMenuDiv.appendChild(aItem);
                aTop += SPACE;
                aImgs[0].addEventListener("click", () => this.sendFurnitureToBuild(key))
            }
        }
        // Refactor - move to EditorManager
        private sendFurnitureToBuild(iname: string) {
            let aObject : any = {};
            aObject.itemName = iname;
            aObject.position = {};
            aObject.position.x = 0;
            aObject.position.y = 0;
            aObject.position.z = 0;
            aObject.rotationY = 90;
            aObject.scale = {};
            aObject.scale.x = 0.05;
            aObject.scale.y = 0.05;
            aObject.scale.z = 0.05;
            FireBaseProxy.instance().updateData("/users/eyal1163/furniture", "2", aObject);



        }

        public getModelURL(iItemName: string): string {
            return this.mCatalog[iItemName].model;
        }
    }
}