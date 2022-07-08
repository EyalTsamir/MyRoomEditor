

namespace room {

    export class SidePanel {


        private mItemDiv: HTMLElement;
        private mSideMenuDiv: HTMLElement;


        constructor(iItemDiv: HTMLElement, iSideMenuDiv: HTMLElement) {
            this.mItemDiv = iItemDiv;
            this.mSideMenuDiv = iSideMenuDiv;
            this.mSideMenuDiv.removeChild(this.mItemDiv);
            FireBaseProxy.instance().getItemsCatalog((iItemsData: any) => this.buildSidePanel(iItemsData))
        }
        //___________________________________________________________

        private buildSidePanel(iItemsData: any) {
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
            }
        }
    }
}
