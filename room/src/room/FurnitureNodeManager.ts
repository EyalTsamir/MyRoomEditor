

namespace room {

    export class FurnitureNodeManager {
        private mNumOfFernicher: number;
        private mfirst: Furniture;
        private mLast: Furniture;



        constructor() {
            this.mNumOfFernicher = 0;
            this.mfirst = null;
            this.mLast = null;
        }

        //___________________________________________________________

        public add(iFurnitureData: any): Furniture {
            let aFurniture: Furniture = new Furniture(iFurnitureData, this.mNumOfFernicher);
            if (this.mfirst == null) {
                this.mfirst = aFurniture;
                this.mLast = aFurniture
                this.mNumOfFernicher = 1;
            } else {
                let aHelper: Furniture = this.mfirst;

                while (aHelper.getNext() != null) {
                    aHelper = aHelper.getNext();
                }
                aHelper.setNext(aFurniture);
                this.mLast = aFurniture;
                this.mNumOfFernicher++;
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




        public getNumOfFernicher(): number {
            return this.mNumOfFernicher;
        }

        public getFrist(): Furniture {
            return this.mfirst;
        }

        public getLast() {
            return this.mLast;
        }

        //___________________________________________________________ Get

    }
}