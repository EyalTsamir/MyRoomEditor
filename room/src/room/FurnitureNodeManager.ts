

namespace room {

    export class FurnitureNodeManager {
        private mfirst: Furniture;
        private mLast: Furniture;



        constructor() {
            this.mfirst = null;
            this.mLast = null;
        }

        //___________________________________________________________

        public add(iFurnitureData: any, iFurnitureIndex : number): Furniture {
            let aFurniture: Furniture = new Furniture(iFurnitureData, iFurnitureIndex);
            if (this.mfirst == null) {
                this.mfirst = aFurniture;
                this.mLast = aFurniture
            } else {
                let aHelper: Furniture = this.mfirst;

                while (aHelper.getNext() != null) {
                    aHelper = aHelper.getNext();
                }
                aHelper.setNext(aFurniture);
                this.mLast = aFurniture;
            }
            return aFurniture;
        }

        public deleteFernicher(iFernicher: Furniture): Furniture {
            if (this.mfirst == null) {
                return null;
            }
            if (this.mfirst == iFernicher) {
                this.mfirst = this.mfirst.getNext();
                return iFernicher;
            }
            let aHelper: Furniture = this.mfirst;
            while (aHelper.getNext() != iFernicher) {
                aHelper = aHelper.getNext();
                if (aHelper == null) {
                    return null;
                }
            }
            aHelper.setNext(aHelper.getNext().getNext());
            return iFernicher;
        }

        public isEmpty(): boolean {
            return this.mfirst == null;
        }

        //___________________________________________________________ Get
        public getFurnicherByIndex(iNumToGet: number): Furniture {
            let aHelper: Furniture = this.mfirst;
            for (var i = 0; i < iNumToGet; i++) {
                aHelper = aHelper.getNext();
            }
            return aHelper;

        }




        public getFrist(): Furniture {
            return this.mfirst;
        }

        public getLast() {
            return this.mLast;
        }

        //___________________________________________________________ Get

        public getNumOfFurniture(): number {
            let aNum: number = 0;
            let aHelper: Furniture = this.mfirst;
            while (aHelper != null) {
                aNum++;
                aHelper = aHelper.getNext();
            }
            return aNum;

        }
    }
}