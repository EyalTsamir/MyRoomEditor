

namespace room {

    export class SidePanel {


        private mItemDiv: HTMLElement;
        private mSideMenuDiv: HTMLElement;
        private mCatalog: any;
        private mEditorManager: EditorManager;
        private mFurnitureSearch: HTMLInputElement;


        constructor(iItemDiv: HTMLElement, iSideMenuDiv: HTMLElement, iEditorManager: EditorManager) {
            this.mEditorManager = iEditorManager;
            this.mItemDiv = iItemDiv;
            this.mSideMenuDiv = iSideMenuDiv;
            this.mSideMenuDiv.removeChild(this.mItemDiv);
            this.mFurnitureSearch = document.getElementById("IDFurnitureSearch") as HTMLInputElement;
            this.mFurnitureSearch.oninput = () => this.onInput();
            FireBaseProxy.instance().loadFurnitureList((iItemsData: any) => this.enterCatalogFromDataAndBuild(iItemsData))
        }
        //___________________________________________________________

        private onInput() {
            let aFilteredCatalog: any = {};
            for (let key in this.mCatalog) {
                if ((this.mCatalog[key].name as string).toLowerCase().indexOf(this.mFurnitureSearch.value.toLowerCase()) > -1) {
                    aFilteredCatalog[key] = this.mCatalog[key]
                }
            }
            this.buildSidePanel(aFilteredCatalog);
        }
        //___________________________________________________________

        private buildSidePanel(iCatalog) {
            this.mSideMenuDiv.innerHTML = "";
            const SPACE = 120;
            let aTop = 5;
            let aItem = this.mItemDiv.cloneNode(true) as HTMLElement;
            for (let key in iCatalog) {
                aItem = this.mItemDiv.cloneNode(true) as HTMLElement;
                let aLabels = aItem.getElementsByTagName("label");
                let aImgs = aItem.getElementsByTagName("img");
                aImgs[0].src = iCatalog[key].Thumbnails;
                aLabels[0].innerHTML = iCatalog[key].name;
                aItem.style.top = aTop + "px";
                this.mSideMenuDiv.appendChild(aItem);
                aTop += SPACE;
                aImgs[0].addEventListener("click", () => this.mEditorManager.sendFurnitureToBuild(key, this.mCatalog))
            }
        }
        private enterCatalogFromDataAndBuild(iItemsData: any) {
            this.mCatalog = iItemsData;
            this.buildSidePanel(this.mCatalog);
        }


        public getModelURL(iItemName: string): string {
            return this.mCatalog[iItemName].model;

            
        }

        public getCatalog(): any {
            return this.mCatalog;
        }
    }
}