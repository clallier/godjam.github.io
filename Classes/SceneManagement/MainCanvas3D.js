/*global THREE, Vector2*/
let MainCanvas3D = function (canvas, sceneKey, options) {
    'use strict';
    // init
    CanvasManager.call(this, canvas, sceneKey, options);

    this.startScene();
};
MainCanvas3D.prototype = Object.create(CanvasManager.prototype);
MainCanvas3D.prototype.constructor = MainCanvas3D;

MainCanvas3D.prototype.resize = function () {
    'use strict';
    if (!this.canvas) {
        console.warn('MainCanvas3D: resize called but canvas is null');
        return null;
    }
    this.size = this.getViewportSize();

    // Threejs resize
    if (this.renderer) {
        this.renderer.setSize(this.size.x, this.size.y);
        this.camera.aspect = this.size.x / this.size.y;
        this.camera.updateProjectionMatrix();
    }

    return this.size;
};


MainCanvas3D.prototype.startScene = function () {
    'use strict';
    if (this.renderer) return; // Prevent double initialization
    
    if (!this.canvas) {
        console.error('MainCanvas3D: startScene failed - canvas element not found');
        return;
    }
    this.size = this.getViewportSize();

    // Threejs objects
    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas
    });
    this.renderer.setClearColor(0xffffff, 1);

    // camera attributes
    let VIEW_ANGLE = 30,
        ASPECT = this.size.x / this.size.y,
        NEAR = 0.1,
        FAR = 10000;

    this.camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );
    this.camera.rotation.order = 'YXZ';

    this.scene = new THREE.Scene();

    // add the camera to the scene
    this.scene.add(this.camera);

    // the camera start position
    this.camera.position.z = 300;

    // Threejs resize
    this.resize();

    CanvasManager.prototype.startScene.call(this);
}

MainCanvas3D.prototype.stopScene = function () {
    'use strict';
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    CanvasManager.prototype.stopScene.call(this);
}