var room;
(function (room) {
    class Main {
        constructor(iMainDiv) {
            this.mCounter = 0;
            this.mMainDiv = iMainDiv;
            setInterval(() => this.update(), 1000);
        }
        //______________________________________
        update() {
            this.mCounter++;
            this.mMainDiv.innerHTML = "Eyal " + this.mCounter;
        }
    }
    room.Main = Main;
})(room || (room = {}));
//# sourceMappingURL=code.js.map