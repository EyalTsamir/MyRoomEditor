

namespace room {

    export class EditorManager {

        public mSidePanel: SidePanel;

        constructor()
        {
            this.createSidePanel();
        }
        //______________________________________

        private createSidePanel()
        {
            let aMainItem = document.getElementById("item");
            let aSideMenu = document.getElementById("side_menu_div");
            this.mSidePanel = new SidePanel(aMainItem, aSideMenu);
           
        }
        //______________________________________

        private update(aDiv: HTMLElement) {
        }

        

        
    }
}
