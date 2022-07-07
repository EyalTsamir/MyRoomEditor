var room;
(function (room) {
    class Main {
        constructor(iMainDiv) {
            this.mCounter = 0;
            this.mMainDiv = iMainDiv;
            let aDiv = this.mMainDiv.cloneNode(true);
            document.body.appendChild(aDiv);
            setInterval(() => this.update(aDiv), 1);
        }
        //______________________________________
        update(aDiv) {
            let aPOS = Math.sin(this.mCounter / 180 * Math.PI) * 200 + 800;
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
    room.Main = Main;
})(room || (room = {}));
//# sourceMappingURL=code.js.map