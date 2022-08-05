

namespace room {

    export class Furniture {
        private mIndexData: number;
        private mName: string;
        private mPositionX: number;
        private mPositionY: number;
        private mPositionZ: number;
        private mRotationY: number;
        private mScaleX: number;
        private mScaleY: number;
        private mScaleZ: number;
        private mNext: Furniture;
        private mModel3D: THREE.Object3D;



        constructor(iDataFurniture: any, iIndexData : number) {
            this.mIndexData = iIndexData;
            this.mName = iDataFurniture.itemName;
            this.mPositionX = iDataFurniture.position.x;
            this.mPositionY = iDataFurniture.position.y;
            this.mPositionZ = iDataFurniture.position.z;
            this.mRotationY = iDataFurniture.rotationY;
            this.mScaleX = iDataFurniture.scale.x;
            this.mScaleY = iDataFurniture.scale.y;
            this.mScaleZ = iDataFurniture.scale.z;
        }
        //___________________________________________________________ Get Object

        public getObject(): any {
            let aObject: any = {};
            aObject.itemName = this.mName;
            aObject.position = {};
            aObject.position.x = this.mPositionX;
            aObject.position.y = this.mPositionY;
            aObject.position.z = this.mPositionZ;
            aObject.rotationY = this.mRotationY;
            aObject.scale = {};
            aObject.scale.x = this.mScaleX;
            aObject.scale.y = this.mScaleY;
            aObject.scale.z = this.mScaleZ;
            return aObject;
        }

        //____________________________________________________________Update Model
        public UpdateModel() {
            this.mModel3D.position.x = this.mPositionX;
            this.mModel3D.position.y = this.mPositionY;
            this.mModel3D.position.z = this.mPositionZ;
            this.mModel3D.rotation.y = this.mRotationY / 180 * Math.PI;
            this.mModel3D.scale.x = this.mScaleX;
            this.mModel3D.scale.y = this.mScaleY;
            this.mModel3D.scale.z = this.mScaleZ;




        }


        //___________________________________________________________ Get/Set Next
        public getNext(): Furniture {
            return this.mNext;
        }

        public setNext(iNext: Furniture) {
            this.mNext = iNext;
        }

        //__________________________________________________________ Addfunctions
        public AddFurniture(iFurniture: Furniture) {
            iFurniture.setNext(this)
        }
        //______________________________________________________________

        public getModel(): THREE.Object3D {
            return this.mModel3D;
        }
        public setModel(iModel: THREE.Object3D) {
            this.mModel3D = iModel;
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

        public getIndexData(): number {
            return this.mIndexData;
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
