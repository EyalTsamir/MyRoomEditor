

namespace room {

    export class SidePanel {


        private mItemDiv: HTMLElement;
        private mSideMenuDiv: HTMLElement;
        private mCatalog: any;
        private mEditorManager: EditorManager;



        constructor(iItemDiv: HTMLElement, iSideMenuDiv: HTMLElement, iEditorManager: EditorManager) {
            this.mEditorManager = iEditorManager;
            this.mItemDiv = iItemDiv;
            this.mSideMenuDiv = iSideMenuDiv;
            this.mSideMenuDiv.removeChild(this.mItemDiv);
            FireBaseProxy.instance().loadFurnitureList((iItemsData: any) => this.buildSidePanel(iItemsData))
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
                aImgs[0].addEventListener("click", () => this.mEditorManager.sendFurnitureToBuild(key, this.mCatalog))
            }
        }

        public getModelURL(iItemName: string): string {
            return this.mCatalog[iItemName].model;
        }
    }
}