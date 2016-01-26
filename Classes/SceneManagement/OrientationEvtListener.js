/*global HTMLCanvasElement*/
// Adapted from http://www.html5rocks.com/en/tutorials/device/orientation/
var OrientationEvtListener = function(canvas, callbackOwner, callback) {
    "use strict";

    if (canvas instanceof HTMLCanvasElement === false) {
        throw "OrientationEvtListener.ctor : canvas is not a HTMLCanvasElement";
    }

    if (!window.DeviceOrientationEvent) {
        console.log("DeviceOrientation is not supported");
    }
    /*
    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

    if (screen.lockOrientationUniversal(["landscape-primary", "landscape-secondary"])) {
      // orientation was locked
    } else {
      // orientation lock failed
    }
    */  
    console.log("The orientation of the screen is: " + screen.orientation);
    screen.lockOrientation(screen.orientation);


    this.canvas = canvas;
    this.callbackOwner = callbackOwner;
    this.callback = null;
    this.callbackRelease = null;

    if (callback !== undefined && callback instanceof Function) {
        this.callback = callback;
    }

    // attach event listener to the doc (with capturing)
    window.addEventListener("deviceorientation", this.move.bind(this));
};

OrientationEvtListener.prototype.stop = function() {
    "use strict";
    window.removeEventListener("deviceorientation", this.move);
    screen.unlockOrientation(screen.orientation);
};

OrientationEvtListener.prototype.move = function(event) {
    "use strict";
    // A voir
    event.preventDefault();
    var absolute = event.absolute,
        dir = event.alpha, // compass direction (in deg)
        tiltFB = event.beta, // front-back (in deg)
        tiltLR = event.gamma; // left-right (in deg)

    // limits tiltFB
    if (tiltFB > 30) {
        tiltFB = 30;
    }
    if (tiltFB < -30) {
        tiltFB = -30;
    }

    // limits tiltLR
    if (tiltLR > 30) {
        tiltLR = 30;
    }
    if (tiltLR < -30) {
        tiltLR = -30;
    }

    console.log(dir, tiltFB, tiltLR);

    // Apply the transform to the canvas
    this.canvas.style.webkitTransform = "rotate3d(0,1,0," + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
    this.canvas.style.MozTransform = "rotate3d(0,1,0," + tiltLR + "deg)";
    this.canvas.style.transform = "rotate3d(0,1,0," + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";

    var bindedCall = this.callback.bind(this.callbackOwner);
    bindedCall(dir, tiltFB, tiltLR);
};

OrientationEvtListener.prototype.update = function() {
    "use strict";
};