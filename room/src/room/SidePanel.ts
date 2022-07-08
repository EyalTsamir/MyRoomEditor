

namespace room {

    export class SidePanel {

        public mItemDiv: HTMLElement;
        public mSideMenuDiv: HTMLElement;


        constructor(iItemDiv: HTMLElement, iSideMenuDiv: HTMLElement) {
            this.mItemDiv = iItemDiv;
            this.mSideMenuDiv = iSideMenuDiv;

            FireBaseProxy.instance().getItemsCatalog((iItemsData: any) => this.buildSidePanel(iItemsData))
        }
        //___________________________________________________________

        private buildSidePanel(iItemsData:any) {
            let aItem = this.mItemDiv.cloneNode(true) as HTMLElement;
            this.mSideMenuDiv.removeChild(this.mItemDiv);
            let atop = 20;
            for (let key in iItemsData) {
                aItem = this.mItemDiv.cloneNode(true) as HTMLElement;
                let aLabels = aItem.getElementsByTagName("label");
                let aImgs = aItem.getElementsByTagName("img");
                aImgs[0].src = iItemsData[key].Thumbnails;
                aLabels[0].innerHTML = iItemsData[key].name;
                aItem.style.top = atop + "px";
                this.mSideMenuDiv.appendChild(aItem);
                atop += 140;
            }
        }
    }
}
