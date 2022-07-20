

namespace room {

    export class FurnitureInformation {

        private mName: string;
        private mPositionX: number;
        private mPositionY: number;
        private mPositionZ: number;
        private mRotationY: number;
        private mScaleX: number;
        private mScaleY: number;
        private mScaleZ: number;



        constructor(iDataFurniture: any) {
            this.mName = iDataFurniture.itemName;
            this.mPositionX = iDataFurniture.position.x;
            this.mPositionY = iDataFurniture.position.y;
            this.mPositionZ = iDataFurniture.position.z;
            this.mRotationY = iDataFurniture.rotationY;
            this.mScaleX = iDataFurniture.scale.x;
            this.mScaleY = iDataFurniture.scale.y;
            this.mScaleZ = iDataFurniture.scale.z;
        }
        //___________________________________________________________ Get functions

        public getName(): string {
            return this.mName;
        }

        public getPositionX(): number {
            return this.mPositionX;
        }

        public getPositionY(): number {
            return this.mPositionY;
        }

        public getPositionZ(): number {
            return this.mPositionZ;
        }

        public getRotationY(): number {
            return this.mRotationY;
        }

        public getScaleX(): number {
            return this.mScaleX;
        }

        public getScaleY(): number {
            return this.mScaleY;
        }

        public getScaleZ(): number {
            return this.mScaleZ;
        }

                //___________________________________________________________ Set functions

        public setName(iName: string) {
            this.mName = iName;
        }

        public setPositionX(iPositionX : number) {
            this.mPositionX = iPositionX;
        }

        public setPositionY(iPositionY: number) {
            this.mPositionY = iPositionY;
        }

        public setPositionZ(iPositionZ: number) {
            this.mPositionZ = iPositionZ;
        }

        public setRotationY(iRotationY: number) {
            this.mRotationY = iRotationY;
        }

        public setScaleX(iScaleX : number) {
            this.mScaleX = iScaleX;
        }

        public setScaleY(iScaleY: number) {
            this.mScaleY = iScaleY;
        }

        public setScaleZ(iScaleZ: number) {
            this.mScaleZ = iScaleZ;
        }

    }

}
