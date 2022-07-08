

namespace room {

    export class SidePanel
    {

        public mItemDiv: HTMLElement;
        public mSideMenuDiv: HTMLElement;


        constructor(iMain_item: HTMLElement, iSide_menu_div: HTMLElement) {
            this.mItemDiv = iMain_item;
            this.mSideMenuDiv = iSide_menu_div;
            let aDiv = this.mItemDiv.cloneNode(true) as HTMLElement;
            this.mSideMenuDiv.removeChild(iMain_item);
            let atop = 20;
            for (var i = 0; i < 10; i++) {
                aDiv = this.mItemDiv.cloneNode(true) as HTMLElement;
                aDiv.style.top = atop + "px";
                this.mSideMenuDiv.appendChild(aDiv);
                atop += 100;
            }
        }
        //______________________________________

        

        

        
    }
}
