

module room {

    export class Main {

        public mMainDiv: HTMLElement;
        public mCounter: number = 0;

        constructor(iMainDiv: HTMLElement) {
            this.mMainDiv = iMainDiv;
            setInterval(()=>this.update(),1000)
        }
        //______________________________________

        private update() {
            this.mCounter++;
            this.mMainDiv.innerHTML = "Eyal " + this.mCounter;
        }
    }
}
