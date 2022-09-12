

namespace room {

    export class FurnitureNodeManager {
        private mfirst: Furniture;
        private mLast: Furniture;



        constructor() {
            this.mfirst = null;
            this.mLast = null;
        }

        //___________________________________________________________

        public add(iFurnitureData: any, iFurnitureID: number, iUUId? : string): Furniture {
            let aFurniture: Furniture = new Furniture(iFurnitureData, iFurnitureID, iUUId);
            if (this.mfirst == null) { ///////////////////////////
                this.mfirst = aFurniture;
                this.mLast = aFurniture
            } else {
                if (this.mfirst.getIndexData() < aFurniture.getIndexData()) { ///////////////////////////
                    let aHelper: Furniture = this.mfirst;
                    while (aHelper.getNext() != null && aHelper.getNext().getIndexData() < aFurniture.getIndexData()) {
                        aHelper = aHelper.getNext();
                    }
                    aFurniture.setNext(aHelper.getNext());
                    aHelper.setNext(aFurniture)
                    if (aFurniture.getNext() == null) {
                        this.mLast = aFurniture;
                    }
                } else { ///////////////////////////
                    aFurniture.setNext(this.mfirst);
                        this.mfirst = aFurniture;
                }
                 }
            return aFurniture;
        }
        //__________________________________________________

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

        //_______________________________________________________

        public getEmptyID(): number {
            let aFurniture = this.mfirst;
            let i = 0;
            while (aFurniture != null) {
                if (aFurniture.getIndexData() != i) {
                    return i;
                }
                aFurniture = aFurniture.getNext();
                i++;
            }
            return i
        }
        //_____________________________________________________
        public findFurnitureByUUID(iUUID: string): Furniture {
            let atemp: Furniture = this.mfirst;
            while (atemp != null) {
                if (atemp.getUuId() == iUUID) {
                    return atemp;
                }
                atemp = atemp.getNext();
            }
            return null;
        }
    }
}