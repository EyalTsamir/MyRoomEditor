var room;
(function (room) {
    class EditorManager {
        constructor(iUserCode) {
            this.mUserCode = iUserCode;
            this.m3Dpage = document.getElementById("3D_page");
            this.m3Dpage.style.display = "block";
            this.createSidePanel();
            this.mRoom3D = new room.Room3D(this);
            this.LoadRoomData();
            this.mFurnitureNodeManager = new room.FurnitureNodeManager();
            this.mFurnitureMenu = new room.FurnitureMenu(this, this.mFurnitureNodeManager);
        }
        //______________________________________
        createSidePanel() {
            let aMainItem = document.getElementById("item");
            let aSideMenu = document.getElementById("side_menu_div");
            this.mSidePanel = new room.SidePanel(aMainItem, aSideMenu, this);
        }
        //______________________________________
        LoadRoomData() {
            room.FireBaseProxy.instance().loadRoomData(this.mUserCode, (iData) => this.LoadRoomDataHelper(iData));
        }
        LoadRoomDataHelper(iData) {
            this.mRoomData = iData;
            this.mTopMenu = new room.TopMenu(this, this.mRoomData, this.mRoom3D);
            let alength = parseFloat(this.mRoomData.Metadata.size.length);
            let aWidth = parseFloat(this.mRoomData.Metadata.size.width);
            this.mRoom3D.createRoom(aWidth, alength);
            if (this.mRoomData.furniture == null) {
                this.mRoomData.furniture = new Array();
            }
            this.buildRoomFurniture(this.mRoomData.furniture);
        }
        //________________________________________________________________
        buildRoomFurniture(iData) {
            let URL;
            for (var i = 0; i < iData.length; i++) {
                if (iData[i].itemName != "Deleted") {
                    let aFurniture = this.mFurnitureNodeManager.add(iData[i], i);
                    URL = this.mSidePanel.getModelURL(iData[i].itemName);
                    this.mRoom3D.addModel(URL, aFurniture);
                }
            }
        }
        //________________________________________________________________
        sendFurnitureToBuild(iname, iCatalog) {
            let aObject = {};
            aObject.itemName = iname;
            aObject.position = {};
            aObject.position.x = 0;
            aObject.position.y = 0.1;
            aObject.position.z = 0;
            aObject.rotationY = 90;
            aObject.scale = {};
            aObject.scale.x = iCatalog[iname].scale;
            aObject.scale.y = iCatalog[iname].scale;
            aObject.scale.z = iCatalog[iname].scale;
            let aFurnitureID = this.mFurnitureNodeManager.getEmptyID();
            let aNewFurniture = this.mFurnitureNodeManager.add(aObject, aFurnitureID);
            this.mRoom3D.addModel(iCatalog[iname].model, aNewFurniture);
            room.FireBaseProxy.instance().updateFurnitureData(aFurnitureID.toString(), aObject);
        }
        //_____________________________________________________________________
        /////   need fixing
        openEditPanelDivEditorFanction(iFurniture) {
            this.mFurnitureMenu.openEditPanelDiv(iFurniture);
        }
        deleteFernicher(iFurniture) {
            let aIndex = iFurniture.getIndexData();
            iFurniture.setName("Deleted");
            let aObj = iFurniture.getObject();
            room.FireBaseProxy.instance().sendDataToFireBase("/users/eyal1163/furniture", aIndex.toString(), aObj);
            this.mRoom3D.deletModel(iFurniture.getModel());
            let aToDelet = this.mFurnitureNodeManager.deleteFernicher(iFurniture);
        }
        get isDragDropActive() {
            return this.mRoom3D.isDragDropActive;
        }
        set isDragDropActive(iVal) {
            this.mRoom3D.isDragDropActive = iVal;
        }
        //______________________________________________
        updatePositionValues(iZ, iX) {
            this.mFurnitureMenu.updatePositionValues(iZ, iX);
        }
        //________________________________
        changeMeshColor(iFurniture3DObg, icolor) {
            iFurniture3DObg.traverse((iFurnitureMesh) => this.mRoom3D.changeMeshColor(iFurnitureMesh, icolor));
        }
    }
    room.EditorManager = EditorManager;
})(room || (room = {}));
var room;
(function (room) {
    class FireBaseProxy {
        constructor() {
            this.mConfig = {
                apiKey: "AIzaSyDWGr8iYh7Lqqsv5LXGa57I43CBKB-oemM",
                authDomain: "myroom-4bc57.firebaseapp.com",
                projectId: "myroom-4bc57",
                appId: "1:320998764719:web:571465031889b61481645a",
            };
            this.connectFireBase();
        }
        static instance() {
            if (FireBaseProxy.mFireBaseProxy == null) {
                FireBaseProxy.mFireBaseProxy = new FireBaseProxy();
            }
            return FireBaseProxy.mFireBaseProxy;
        }
        //____________________________________________________
        async connectFireBase() {
            this.mConfig.databaseURL = "https://myroom-4bc57-default-rtdb.firebaseio.com";
            const aApp = firebase.initializeApp(this.mConfig);
            await aApp.auth().signInAnonymously().then((snap) => this.onGetCollabAuthId(snap)).catch((error) => this.failGetCollabAuthId(error));
            this.mDB = firebase.database(aApp);
        }
        //________________________________________________________
        loadFurnitureList(iCallback) {
            let aItemsCatalogRef = this.mDB.ref("ItemsCatalog");
            aItemsCatalogRef.on("value", (iData) => { iCallback(iData.val()); });
        }
        //________________________________________________________
        checkIfUserExsit(iUserName, iPassword, iIsUserExsistCallback) {
            let aItemsCatalogRef = this.mDB.ref("users/" + iUserName + "/_password");
            aItemsCatalogRef.on("value", (iData) => {
                this.passwordVerificationHelper(iIsUserExsistCallback, iPassword, iData.val(), iUserName);
            });
        }
        //___________________________________________
        passwordVerificationHelper(iIsUserExsistCallback, iPassword, iDataVal, iUserName) {
            if (iDataVal == iPassword) {
                this.mUserName = iUserName;
                iIsUserExsistCallback(true);
            }
            else {
                iIsUserExsistCallback(false);
            }
        }
        //_________________________________________________
        checkIfRegistrationCorrect(iUserName, iIsRegistrationCorrect) {
            let aItemsCatalogRef = this.mDB.ref("users/" + iUserName + "/_password"); //�����: �� �� �� ����� ����� ���� 
            aItemsCatalogRef.on("value", (iData) => {
                this.checkIfRegistrationCorrectHelper(iIsRegistrationCorrect, iData.val());
            });
        }
        checkIfRegistrationCorrectHelper(iIsRegistrationCorrectCallback, iDataVal) {
            if (iDataVal == null) {
                iIsRegistrationCorrectCallback(true);
            }
            else {
                iIsRegistrationCorrectCallback(false);
            }
        }
        //___________________________________________
        loadRoomData(iUserCode, iCallback) {
            let aUserData = this.mDB.ref("users/" + iUserCode);
            aUserData.once("value", (iData) => { iCallback(iData.val()); });
        }
        //________________________________________________________
        sendDataToFireBase(iTo, iChild, iData) {
            let aDataRef = this.mDB.ref(iTo);
            aDataRef.child(iChild).update(iData, (iError) => { console.log(iError); });
        }
        //________________________________________________________
        updateFurnitureData(iID, iData) {
            clearTimeout(this.mUpdateFireBaseTimeOut);
            this.mUpdateFireBaseTimeOut = setTimeout(() => this.sendDataToFireBase("/users/" + this.mUserName + "/furniture", iID, iData), 300);
        }
        updateMetaData(iData) {
            this.sendDataToFireBase("/users/" + this.mUserName, "Metadata", iData);
        }
        //____________________________________________________
        async onGetCollabAuthId(snap) { }
        //____________________________________________________
        async failGetCollabAuthId(error) { }
    }
    room.FireBaseProxy = FireBaseProxy;
})(room || (room = {}));
var room;
(function (room) {
    class Furniture {
        constructor(iDataFurniture, iID) {
            this.mName = iDataFurniture.itemName;
            this.mPositionX = iDataFurniture.position.x;
            this.mPositionY = iDataFurniture.position.y;
            this.mPositionZ = iDataFurniture.position.z;
            this.mRotationY = iDataFurniture.rotationY;
            this.mScaleX = iDataFurniture.scale.x;
            this.mScaleY = iDataFurniture.scale.y;
            this.mScaleZ = iDataFurniture.scale.z;
            this.mID = iID;
        }
        //___________________________________________________________ Get Object
        getObject() {
            let aObject = {};
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
        UpdateModel() {
            this.mModel3D.position.x = this.mPositionX;
            this.mModel3D.position.y = this.mPositionY;
            this.mModel3D.position.z = this.mPositionZ;
            this.mModel3D.rotation.y = this.mRotationY / 180 * Math.PI;
            this.mModel3D.scale.x = this.mScaleX;
            this.mModel3D.scale.y = this.mScaleY;
            this.mModel3D.scale.z = this.mScaleZ;
        }
        //____________________________________________________________
        CopyFrom(iFurniture) {
            this.mPositionX = iFurniture.getPositionX();
            this.mPositionY = iFurniture.getPositionY();
            this.mPositionZ = iFurniture.getPositionZ();
            this.mRotationY = iFurniture.getRotationY();
            this.mScaleX = iFurniture.getScaleX();
            this.mScaleY = iFurniture.getScaleY();
            this.mScaleZ = iFurniture.getScaleZ();
        }
        //____________________________________________________________
        isEqualParameter(iFurniture) {
            return (iFurniture.getPositionX() == this.mPositionX &&
                iFurniture.getPositionY() == this.mPositionY &&
                iFurniture.getPositionZ() == this.mPositionZ &&
                iFurniture.getRotationY() == this.mRotationY &&
                iFurniture.getScaleX() == this.mScaleX &&
                iFurniture.getScaleY() == this.mScaleY &&
                iFurniture.getScaleZ() == this.mScaleZ);
        }
        //___________________________________________________________ Get/Set Next
        getNext() {
            return this.mNext;
        }
        setNext(iNext) {
            this.mNext = iNext;
        }
        //__________________________________________________________ Addfunctions
        AddFurniture(iFurniture) {
            iFurniture.setNext(this);
        }
        //______________________________________________________________
        getModel() {
            return this.mModel3D;
        }
        setModel(iModel) {
            this.mModel3D = iModel;
        }
        //___________________________________________________________ Get functions
        getName() {
            return this.mName;
        }
        getPositionX() {
            return this.mPositionX;
        }
        getPositionY() {
            return this.mPositionY;
        }
        getPositionZ() {
            return this.mPositionZ;
        }
        getRotationY() {
            return this.mRotationY;
        }
        getScaleX() {
            return this.mScaleX;
        }
        getScaleY() {
            return this.mScaleY;
        }
        getScaleZ() {
            return this.mScaleZ;
        }
        getIndexData() {
            return this.mID;
        }
        //___________________________________________________________ Set functions
        setName(iName) {
            this.mName = iName;
        }
        setPositionX(iPositionX) {
            this.mPositionX = iPositionX;
        }
        setPositionY(iPositionY) {
            this.mPositionY = iPositionY;
        }
        setPositionZ(iPositionZ) {
            this.mPositionZ = iPositionZ;
        }
        setRotationY(iRotationY) {
            this.mRotationY = iRotationY;
        }
        setScaleX(iScaleX) {
            this.mScaleX = iScaleX;
        }
        setScaleY(iScaleY) {
            this.mScaleY = iScaleY;
        }
        setScaleZ(iScaleZ) {
            this.mScaleZ = iScaleZ;
        }
    }
    room.Furniture = Furniture;
})(room || (room = {}));
var room;
(function (room) {
    class FurnitureMenu {
        constructor(iEditorManager, iFurnitureNodeManager) {
            this.mEditorManager = iEditorManager;
            this.mEditorManager.isDragDropActive = false;
            this.mPositionXInput = document.getElementById("PositionX");
            this.mPositionYInput = document.getElementById("PositionY");
            this.mPositionZInput = document.getElementById("PositionZ");
            this.mRotationYInput = document.getElementById("RotationY");
            this.mScaleXInput = document.getElementById("ScaleX");
            this.mScaleYInput = document.getElementById("ScaleY");
            this.mScaleZInput = document.getElementById("ScaleZ");
            this.mEditPanelDiv = document.getElementById("Furniture_menu");
            this.mNameFurnitureDiv = document.getElementById("NameOfEditedFurniture");
            this.mCancelButton = document.getElementById("CancelButton");
            this.mDeleteButton = document.getElementById("DeleteButton");
            this.mDragDropButton = document.getElementById("DragDrop");
            this.mDragDropButton.onclick = () => this.onDragDrop();
            this.mCancelButton.onclick = () => this.onClose();
            this.mDeleteButton.onclick = () => this.deleteFernicher();
            setInterval(() => this.cuntinusUpdate(), 100);
        }
        //__________________________________________________________
        openEditPanelDiv(iFurniture) {
            this.mFurniture = iFurniture;
            this.mEditPanelDiv.style.display = "block";
            this.mNameFurnitureDiv.innerHTML = this.mFurniture.getName();
            this.mPositionXInput.value = "" + this.mFurniture.getPositionX();
            this.mPositionYInput.value = "" + this.mFurniture.getPositionY();
            this.mPositionZInput.value = "" + this.mFurniture.getPositionZ();
            this.mRotationYInput.value = "" + this.mFurniture.getRotationY();
            this.mScaleXInput.value = "" + this.mFurniture.getScaleX() * 100;
            this.mScaleYInput.value = "" + this.mFurniture.getScaleY() * 100;
            this.mScaleZInput.value = "" + this.mFurniture.getScaleZ() * 100;
        }
        //__________________________________________________________
        cuntinusUpdate() {
            if (this.mFurniture == null) {
                return;
            }
            let aObject = {};
            aObject.itemName = this.mFurniture.getName();
            aObject.position = {};
            if (parseFloat(this.mPositionYInput.value) < 0.1) {
                this.mPositionYInput.value = "0.1";
            }
            aObject.position.x = parseFloat(this.mPositionXInput.value);
            aObject.position.y = parseFloat(this.mPositionYInput.value);
            aObject.position.z = parseFloat(this.mPositionZInput.value);
            aObject.rotationY = parseFloat(this.mRotationYInput.value);
            aObject.scale = {};
            if (parseFloat(this.mScaleXInput.value) < 0.1) {
                this.mScaleXInput.value = "0.1";
            }
            if (parseFloat(this.mScaleYInput.value) < 0.1) {
                this.mScaleYInput.value = "0.1";
            }
            if (parseFloat(this.mScaleZInput.value) < 0.1) {
                this.mScaleZInput.value = "0.1";
            }
            aObject.scale.x = parseFloat(this.mScaleXInput.value) / 100;
            aObject.scale.y = parseFloat(this.mScaleYInput.value) / 100;
            aObject.scale.z = parseFloat(this.mScaleZInput.value) / 100;
            let aTempFurniture = new room.Furniture(aObject, this.mFurniture.getIndexData());
            if (this.mFurniture.isEqualParameter(aTempFurniture)) {
                return;
            }
            this.mFurniture.CopyFrom(aTempFurniture);
            room.FireBaseProxy.instance().updateFurnitureData(this.mFurniture.getIndexData().toString(), this.mFurniture.getObject());
            this.mFurniture.UpdateModel();
        }
        //__________________________________________________________
        updatePositionValues(iZ, iX) {
            this.mPositionXInput.value = "" + iX;
            this.mPositionZInput.value = "" + iZ;
        }
        //_____________________________________________________________
        onClose() {
            this.mEditPanelDiv.style.display = "none";
            this.mEditorManager.isDragDropActive = false;
            this.mEditorManager.changeMeshColor(this.mFurniture.getModel(), 0xffffff);
        }
        onDragDrop() {
            if (!this.mEditorManager.isDragDropActive) {
                this.mEditorManager.isDragDropActive = true;
                this.mDragDropButton.style.backgroundColor = "green";
                this.mDragDropButton.innerHTML = "Stop Drag";
            }
            else {
                this.mEditorManager.isDragDropActive = false;
                this.mDragDropButton.style.backgroundColor = "yellow";
                this.mDragDropButton.innerHTML = "Start Drag";
            }
        }
        deleteFernicher() {
            this.mEditPanelDiv.style.display = "none";
            this.mEditorManager.isDragDropActive = false;
            this.mEditorManager.deleteFernicher(this.mFurniture);
        }
    }
    room.FurnitureMenu = FurnitureMenu;
})(room || (room = {}));
var room;
(function (room) {
    class FurnitureNodeManager {
        constructor() {
            this.mfirst = null;
            this.mLast = null;
        }
        //___________________________________________________________
        add(iFurnitureData, iFurnitureID) {
            let aFurniture = new room.Furniture(iFurnitureData, iFurnitureID);
            if (this.mfirst == null) { ///////////////////////////
                this.mfirst = aFurniture;
                this.mLast = aFurniture;
            }
            else {
                if (this.mfirst.getIndexData() < aFurniture.getIndexData()) { ///////////////////////////
                    let aHelper = this.mfirst;
                    while (aHelper.getNext() != null && aHelper.getNext().getIndexData() < aFurniture.getIndexData()) {
                        aHelper = aHelper.getNext();
                    }
                    aFurniture.setNext(aHelper.getNext());
                    aHelper.setNext(aFurniture);
                    if (aFurniture.getNext() == null) {
                        this.mLast = aFurniture;
                    }
                }
                else { ///////////////////////////
                    aFurniture.setNext(this.mfirst);
                    this.mfirst = aFurniture;
                }
            }
            return aFurniture;
        }
        //__________________________________________________
        deleteFernicher(iFernicher) {
            if (this.mfirst == null) {
                return null;
            }
            if (this.mfirst == iFernicher) {
                this.mfirst = this.mfirst.getNext();
                return iFernicher;
            }
            let aHelper = this.mfirst;
            while (aHelper.getNext() != iFernicher) {
                aHelper = aHelper.getNext();
                if (aHelper == null) {
                    return null;
                }
            }
            aHelper.setNext(aHelper.getNext().getNext());
            return iFernicher;
        }
        isEmpty() {
            return this.mfirst == null;
        }
        //___________________________________________________________ Get
        getFurnicherByIndex(iNumToGet) {
            let aHelper = this.mfirst;
            for (var i = 0; i < iNumToGet; i++) {
                aHelper = aHelper.getNext();
            }
            return aHelper;
        }
        getFrist() {
            return this.mfirst;
        }
        getLast() {
            return this.mLast;
        }
        //___________________________________________________________ Get
        getNumOfFurniture() {
            let aNum = 0;
            let aHelper = this.mfirst;
            while (aHelper != null) {
                aNum++;
                aHelper = aHelper.getNext();
            }
            return aNum;
        }
        //_______________________________________________________
        getEmptyID() {
            let aFurniture = this.mfirst;
            let i = 0;
            while (aFurniture != null) {
                if (aFurniture.getIndexData() != i) {
                    return i;
                }
                aFurniture = aFurniture.getNext();
                i++;
            }
            return i;
        }
    }
    room.FurnitureNodeManager = FurnitureNodeManager;
})(room || (room = {}));
var room;
(function (room) {
    class Login {
        constructor(iLoginMenu, iCallBack) {
            this.mCallBack = iCallBack;
            this.mLoginMenuDiv = iLoginMenu;
            const aLoginBotton = document.getElementById("loginBotton");
            aLoginBotton.addEventListener("click", () => this.checkLogin());
            const aMoveToRegisterButton = document.getElementById("MoveToRegisterButton");
            aMoveToRegisterButton.addEventListener("click", () => this.MoveToRegister());
            this.mFailLogin = document.getElementById("failLogin");
            this.mRegisterDiv = document.getElementById("register");
        }
        //______________________________________
        checkLogin() {
            this.mUserName = document.getElementById("IdUserName").value;
            let aPassword = document.getElementById("Idpassword").value;
            room.FireBaseProxy.instance().checkIfUserExsit(this.mUserName, aPassword, (UserCode) => this.Load(UserCode));
        }
        //______________________________________
        Load(isLoginSuccess) {
            if (isLoginSuccess) {
                this.mLoginMenuDiv.style.display = "none";
                this.mCallBack(this.mUserName);
            }
            else {
                this.mFailLogin.style.display = "block";
            }
        }
        //______________________________________
        MoveToRegister() {
            let aLoginMenu = document.getElementById("login");
            aLoginMenu.style.display = "none";
            let aRegisterMenu = document.getElementById("register");
            aRegisterMenu.style.display = "block";
            const aFailRegister = document.getElementById("failRegister");
            aFailRegister.style.display = "none";
            let aRegister = new room.Register(() => this.FinishRegister());
            let aLoginAndRegisterDiv = document.getElementById("login_and_register");
            aLoginAndRegisterDiv.style.backgroundColor = "aliceblue";
        }
        FinishRegister() {
            this.mLoginMenuDiv.style.display = "block";
            this.mRegisterDiv.style.display = "none";
            let aLoginAndRegisterDiv = document.getElementById("login_and_register");
            aLoginAndRegisterDiv.style.backgroundColor = "cornsilk";
            let afailLoginDiv = document.getElementById("failLogin");
            afailLoginDiv.style.display = "none";
        }
        update(aDiv) {
        }
    }
    room.Login = Login;
})(room || (room = {}));
var room;
(function (room) {
    class Main {
        constructor() {
            this.createLogin();
            room.FireBaseProxy.instance();
        }
        //______________________________________
        createLogin() {
            let aLoginMenu = document.getElementById("login");
            this.mLogin = new room.Login(aLoginMenu, (iUserCode) => this.openEditorManager(iUserCode));
        }
        //__________________________________________
        openEditorManager(iUserCode) {
            this.mEditorManager = new room.EditorManager(iUserCode);
        }
    }
    room.Main = Main;
})(room || (room = {}));
var room;
(function (room) {
    class Register {
        constructor(iCallBack) {
            this.mCallBack = iCallBack;
            const aRegisterBotton = document.getElementById("RegisterBotton");
            aRegisterBotton.addEventListener("click", () => this.checkaRegister());
            const aMoveToLoginBotton = document.getElementById("MoveToLoginBotton");
            aMoveToLoginBotton.addEventListener("click", () => this.mCallBack());
            this.mFailRegister = document.getElementById("failRegister");
        }
        //______________________________________
        checkaRegister() {
            this.mUserName = document.getElementById("IdUserNameRegister").value;
            room.FireBaseProxy.instance().checkIfRegistrationCorrect(this.mUserName, (iISRegistrationCorrect) => this.Load(iISRegistrationCorrect));
        }
        //______________________________________
        Load(iISRegistrationCorrect) {
            if (!iISRegistrationCorrect) {
                this.mFailRegister.style.display = "block";
            }
            else {
                this.mCallBack();
                let aObject = {};
                aObject.Metadata = {};
                aObject.Metadata.name = document.getElementById("IdRoomNameRegister").value;
                aObject.Metadata.size = {};
                aObject.Metadata.size.length = document.getElementById("IdRoomLengthRegister").value; // ������ �����
                aObject.Metadata.size.width = document.getElementById("IdRoomWidthRegister").value; // ������ �����
                aObject.email = document.getElementById("IdEmailRegister").value;
                aObject._password = document.getElementById("IdPasswordRegister").value;
                room.FireBaseProxy.instance().sendDataToFireBase("/users", this.mUserName, aObject);
            }
        }
        //______________________________________
        MoveToRegister() {
            let aLoginMenu = document.getElementById("login");
            aLoginMenu.style.display = "none";
            let aRegisterMenu = document.getElementById("register");
            aRegisterMenu.style.display = "block";
        }
        update(aDiv) {
        }
    }
    room.Register = Register;
})(room || (room = {}));
var room;
(function (room) {
    class Room3D {
        constructor(iEditorManager) {
            this.mIsInDrag = false;
            this.mEditorManager = iEditorManager;
            //����� ����
            this.createScene();
            // ����� ��������
            this.createController();
            //�������
            this.animate();
            this.mFurnitureMesh = new Array();
            this.mWalls = new Array();
            window.addEventListener('resize', () => this.onWindowResize());
        }
        //__________________________________________________________________
        createScene() {
            this.mDiv3D = document.getElementById('3D_room');
            this.mDiv3D.onclick = (iEvent) => this.onClick(iEvent);
            this.mDiv3D.onmousedown = (iEvent) => this.onMouseDown(iEvent);
            this.mDiv3D.onmousemove = (iEvent) => this.onMouseMove(iEvent);
            this.mDiv3D.onmouseup = (iEvent) => this.onMouseUp(iEvent);
            this.mRenderer = new THREE.WebGLRenderer({ antialias: true });
            const aRect = this.mDiv3D.getBoundingClientRect();
            this.mRenderer.setSize(aRect.width, aRect.height);
            this.mDiv3D.appendChild(this.mRenderer.domElement);
            this.mScene = new THREE.Scene();
            this.mScene.background = new THREE.Color(0xbfe3dd);
            this.mCamera = new THREE.PerspectiveCamera(60, aRect.width / aRect.height, 1, 300);
            this.mCamera.position.set(5, 13, -8);
            const aDirectionalLight = new THREE.PointLight(0xffefbf, 1);
            aDirectionalLight.position.x = 0;
            aDirectionalLight.position.y = 8;
            aDirectionalLight.position.z = 0;
            aDirectionalLight.lookAt(0, 0, 0);
            this.mScene.add(aDirectionalLight);
        }
        //___________________________________________________________________________
        addModel(iURL, iData) {
            const aLoader = new THREE.GLTFLoader();
            aLoader.load(iURL, (iModel) => this.loadModelHelper(iModel, iData));
        }
        //___________________________________________________________________________
        loadModelHelper(iModel, iFurnitureData) {
            let aModel = iModel.scene;
            aModel.traverse((iFurnitureMesh) => this.forAllFurnitureMesh(iFurnitureMesh));
            iFurnitureData.setModel(aModel);
            // @ts-ignore
            aModel.furnitureData = iFurnitureData;
            this.mScene.add(aModel);
            aModel.position.x = iFurnitureData.getPositionX();
            aModel.position.y = iFurnitureData.getPositionY();
            aModel.position.z = iFurnitureData.getPositionZ();
            aModel.scale.x = iFurnitureData.getScaleX();
            aModel.scale.y = iFurnitureData.getScaleY();
            aModel.scale.z = iFurnitureData.getScaleZ();
            aModel.rotateY((iFurnitureData.getRotationY() / 180) * Math.PI);
        }
        //___________________________________________________________________
        deletModel(iModel) {
            this.mScene.remove(iModel);
            iModel.traverse((iFurnitureMesh) => this.removeAllFurnitureMesh(iFurnitureMesh));
        }
        //___________________________________________________________________________
        removeAllFurnitureMesh(iFurnitureMesh) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                let aIndex = this.mFurnitureMesh.indexOf(iFurnitureMesh);
                if (aIndex == -1) {
                    return;
                }
                this.mFurnitureMesh.splice(aIndex, 1);
            }
        }
        //___________________________________________________________________________
        forAllFurnitureMesh(iFurnitureMesh) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                this.mFurnitureMesh.push(iFurnitureMesh);
            }
        }
        //___________________________________________________________________________
        getFurnitureUnderMouse(iEvent) {
            const raycaster = new THREE.Raycaster();
            const pointer = new THREE.Vector2();
            let aRect = this.mDiv3D.getBoundingClientRect();
            let aX = iEvent.clientX - aRect.left;
            let aY = iEvent.clientY - aRect.top;
            pointer.x = (aX / aRect.width) * 2 - 1;
            pointer.y = -(aY / aRect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, this.mCamera);
            const intersects = raycaster.intersectObjects(this.mFurnitureMesh);
            if (intersects.length > 0) {
                let aFurniture = this.getMeshFurniture(intersects[0].object);
                return aFurniture;
            }
        }
        //___________________________________________________________________________
        onClick(iEvent) {
            let aFurniture = this.getFurnitureUnderMouse(iEvent);
            this.clickOnFurniture(aFurniture);
        }
        //___________________________________________________________________________
        getMeshFurniture(i3DObj) {
            if (i3DObj == null) {
                return;
            }
            // @ts-ignore
            if (i3DObj.furnitureData == null) {
                return this.getMeshFurniture(i3DObj.parent);
            }
            else {
                return i3DObj;
            }
        }
        //___________________________________________________
        clickOnFurniture(i3DObj) {
            if (i3DObj == null) {
                return;
            }
            // @ts-ignore
            if (!this.mIsDragDropActive) {
                // @ts-ignore
                this.mEditorManager.openEditPanelDivEditorFanction(i3DObj.furnitureData);
                if (this.mCurrentlyEditing != null && this.mCurrentlyEditing != i3DObj) {
                    this.mCurrentlyEditing.traverse((iFurnitureMesh) => this.changeMeshColor(iFurnitureMesh, 0xffffff));
                }
                this.mCurrentlyEditing = i3DObj;
                i3DObj.traverse((iFurnitureMesh) => this.changeMeshColor(iFurnitureMesh, 0xff0000));
            }
        }
        //___________________________________________________________________________
        onMouseDown(iEvent) {
            if (this.mIsDragDropActive) {
                let aFurniture = this.getFurnitureUnderMouse(iEvent);
                if (this.mCurrentlyEditing == aFurniture) {
                    aFurniture.traverse((iFurnitureMesh) => this.changeMeshColor(iFurnitureMesh, 0x04ff00));
                    this.mIsInDrag = true;
                }
            }
        }
        //___________________________________________________________________________
        onMouseMove(iEvent) {
            if (this.mCurrentlyEditing == null) {
                return;
            }
            if (this.mIsDragDropActive && this.mIsInDrag) {
                const raycaster = new THREE.Raycaster();
                const pointer = new THREE.Vector2();
                let aRect = this.mDiv3D.getBoundingClientRect();
                let aX = iEvent.clientX - aRect.left;
                let aY = iEvent.clientY - aRect.top;
                pointer.x = (aX / aRect.width) * 2 - 1;
                pointer.y = -(aY / aRect.height) * 2 + 1;
                raycaster.setFromCamera(pointer, this.mCamera);
                const intersects = raycaster.intersectObject(this.mFloor, false);
                if (intersects.length == 0) {
                    return;
                }
                let aPosX = Math.round(intersects[0].point.x * 1000) / 1000;
                let aPosZ = Math.round(intersects[0].point.z * 1000) / 1000;
                this.mCurrentlyEditing.position.x = aPosX;
                this.mCurrentlyEditing.position.z = aPosZ;
                this.mEditorManager.updatePositionValues(aPosZ, aPosX);
            }
        }
        //___________________________________________________________________________
        onMouseUp(iEvent) {
            if (this.mIsInDrag) {
                this.mIsInDrag = false;
                this.mCurrentlyEditing.traverse((iFurnitureMesh) => this.changeMeshColor(iFurnitureMesh, 0xff0000));
            }
        }
        //___________________________________________________________________________
        changeMeshColor(iFurnitureMesh, iColor) {
            if (iFurnitureMesh instanceof THREE.Mesh) {
                iFurnitureMesh.material.color = new THREE.Color(iColor);
            }
        }
        //___________________________________________________________________________
        createController() {
            // @ts-ignore
            this.mOrbitControls = new THREE.OrbitControls(this.mCamera, this.mRenderer.domElement);
            this.mOrbitControls.target.set(0, (Room3D.Y_FLOOR + Room3D.HEIGHT) / 2, 0);
            this.mOrbitControls.enablePan = false;
            this.mOrbitControls.enableDamping = true;
        }
        //___________________________________________________________________________
        createRoom(iWidth, iLength) {
            while (this.mWalls.length > 0) {
                this.mScene.remove(this.mWalls.pop());
            }
            let aGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            let aMaterial = new THREE.MeshPhongMaterial();
            const aCube = new THREE.Mesh(aGeometry, aMaterial);
            aCube.position.x = 0;
            aCube.position.y = 0;
            aCube.position.z = 0;
            aGeometry = new THREE.BoxGeometry(iWidth, Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            this.mFloor = new THREE.Mesh(aGeometry, aMaterial);
            this.mFloor.position.y = Room3D.Y_FLOOR;
            aGeometry = new THREE.BoxGeometry(iWidth, Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            const aTop = new THREE.Mesh(aGeometry, aMaterial);
            aTop.position.y = Room3D.Y_FLOOR + Room3D.HEIGHT;
            aGeometry = new THREE.BoxGeometry(Room3D.WALL_WIDTH, Room3D.HEIGHT + Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall = new THREE.Mesh(aGeometry, aMaterial);
            aWall.position.x = iWidth / 2;
            aWall.position.y = Room3D.HEIGHT / 2;
            aGeometry = new THREE.BoxGeometry(0.2, Room3D.HEIGHT + Room3D.WALL_WIDTH, iLength);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall2 = new THREE.Mesh(aGeometry, aMaterial);
            aWall2.position.x = -1 * iWidth / 2;
            aWall2.position.y = Room3D.HEIGHT / 2;
            aGeometry = new THREE.BoxGeometry(iWidth + Room3D.WALL_WIDTH, Room3D.HEIGHT + Room3D.WALL_WIDTH, 0.2);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall3 = new THREE.Mesh(aGeometry, aMaterial);
            aWall3.position.z = -1 * iLength / 2;
            aWall3.position.y = Room3D.HEIGHT / 2;
            aGeometry = new THREE.BoxGeometry(iWidth + Room3D.WALL_WIDTH, Room3D.HEIGHT + Room3D.WALL_WIDTH, 0.2);
            aMaterial = new THREE.MeshPhongMaterial();
            const aWall4 = new THREE.Mesh(aGeometry, aMaterial);
            aWall4.position.z = iLength / 2;
            aWall4.position.y = Room3D.HEIGHT / 2;
            this.mWalls.push(aTop);
            this.mWalls.push(this.mFloor);
            this.mWalls.push(aWall);
            this.mWalls.push(aWall2);
            this.mWalls.push(aWall3);
            this.mWalls.push(aWall4);
            this.mScene.add(this.mFloor);
            //this.mScene.add(aTop);
            this.mScene.add(aCube);
            this.mScene.add(aWall);
            this.mScene.add(aWall2);
            this.mScene.add(aWall3);
            this.mScene.add(aWall4);
        }
        //___________________________________________________________________________
        animate() {
            requestAnimationFrame(() => this.animate());
            this.mOrbitControls.update();
            this.mRenderer.render(this.mScene, this.mCamera);
        }
        //___________________________________________________________________________________
        onWindowResize() {
            const aRect = this.mDiv3D.getBoundingClientRect();
            this.mRenderer.setSize(aRect.width, aRect.height);
            this.mCamera.aspect = aRect.width / aRect.height;
            this.mCamera.updateProjectionMatrix();
        }
        //___________________________________________________________________________________
        get isDragDropActive() {
            return this.mIsDragDropActive;
        }
        set isDragDropActive(iVal) {
            this.mOrbitControls.enabled = !iVal;
            this.mIsDragDropActive = iVal;
        }
    }
    Room3D.Y_FLOOR = 0;
    Room3D.HEIGHT = 3;
    Room3D.WALL_WIDTH = 0.2;
    room.Room3D = Room3D;
})(room || (room = {}));
var room;
(function (room) {
    class SidePanel {
        constructor(iItemDiv, iSideMenuDiv, iEditorManager) {
            this.mEditorManager = iEditorManager;
            this.mItemDiv = iItemDiv;
            this.mSideMenuDiv = iSideMenuDiv;
            this.mSideMenuDiv.removeChild(this.mItemDiv);
            room.FireBaseProxy.instance().loadFurnitureList((iItemsData) => this.buildSidePanel(iItemsData));
        }
        //___________________________________________________________
        buildSidePanel(iItemsData) {
            this.mCatalog = iItemsData;
            const SPACE = 120;
            let aTop = 5;
            let aItem = this.mItemDiv.cloneNode(true);
            for (let key in iItemsData) {
                aItem = this.mItemDiv.cloneNode(true);
                let aLabels = aItem.getElementsByTagName("label");
                let aImgs = aItem.getElementsByTagName("img");
                aImgs[0].src = iItemsData[key].Thumbnails;
                aLabels[0].innerHTML = iItemsData[key].name;
                aItem.style.top = aTop + "px";
                this.mSideMenuDiv.appendChild(aItem);
                aTop += SPACE;
                aImgs[0].addEventListener("click", () => this.mEditorManager.sendFurnitureToBuild(key, this.mCatalog));
            }
        }
        getModelURL(iItemName) {
            return this.mCatalog[iItemName].model;
        }
    }
    room.SidePanel = SidePanel;
})(room || (room = {}));
var room;
(function (room) {
    class TopMenu {
        constructor(iEditorManager, iRoomData, iRoom3D) {
            this.mEditorManager = iEditorManager;
            this.mRoom3D = iRoom3D;
            this.mRoomNameInput = document.getElementById("IDRoomNameMenu");
            this.mRoomLengtInput = document.getElementById("IDRoomLengtMenu");
            this.mRoomWidthInput = document.getElementById("IDRoomWidthMenu");
            this.mRoomNameInput.value = iRoomData.Metadata.name;
            this.mRoomLengtInput.value = iRoomData.Metadata.size.length;
            this.mRoomWidthInput.value = iRoomData.Metadata.size.width;
            this.mRoomLengtInput.onchange = () => this.cuntinusUpdate();
            this.mRoomNameInput.onchange = () => this.cuntinusUpdate();
            this.mRoomWidthInput.onchange = () => this.cuntinusUpdate();
            //setInterval(() => this.cuntinusUpdate(), 100)
        }
        //__________________________________________________________
        //__________________________________________________________
        cuntinusUpdate() {
            let aLength = this.mRoomLengtInput.value;
            let aWidth = this.mRoomWidthInput.value;
            let aName = this.mRoomNameInput.value;
            let aObject = {};
            aObject.name = aName;
            aObject.size = {};
            aObject.size.length = aLength;
            aObject.size.width = aWidth;
            this.mRoom3D.createRoom(parseFloat(aWidth), parseFloat(aLength));
            room.FireBaseProxy.instance().updateMetaData(aObject);
            //__________________________________________________________
            //_____________________________________________________________
        }
    }
    room.TopMenu = TopMenu;
})(room || (room = {}));
//# sourceMappingURL=code.js.map