

module room {

    export class Main {

        public mMainDiv: HTMLElement;
        public mCounter: number = 0;

        constructor(iMainDiv: HTMLElement) {
            this.mMainDiv = iMainDiv;
            let aDiv = this.mMainDiv.cloneNode(true) as HTMLElement;
            document.body.appendChild(aDiv);
            setInterval(() => this.update(aDiv), 1);

        }
        //______________________________________

        private update(aDiv: HTMLElement) {
            let aPOS = Math.sin(this.mCounter / 180 * Math.PI) * 200 + 500
            this.mCounter += 1;
            this.mMainDiv.innerHTML = "Eyal " + this.mCounter;
            if (this.mCounter == 1800) {
                this.mCounter = 0;
            }
            aDiv.style.top = aPOS + "px";
            aDiv.style.left = this.mCounter + "px";
            aDiv.style.borderColor = "#" + (this.mCounter * this.mCounter).toString(16);
            aDiv.innerHTML = "" + (this.mCounter * this.mCounter).toString(16) + " - " + (this.mCounter);

        }
    }
}
