/*global FrameLoop, THREE, Vector2*/
let CanvasManager = function (canvasID, sceneKey, options) {
    'use strict';
    // visibility
    this.isVisible = false;
    this.listenToevents = true;

    // canvas
    this.canvas = document.getElementById(canvasID);
    if (!this.canvas)
        console.log(canvasID + ' does not exists');
    
    // sceneKey
    this.sceneKey = sceneKey;
    this.sceneInstance = null;
    this.options = options;
    
    this.observer = new IntersectionObserver((entries, obs) => this.visibilityChange(entries, obs));
    this.observer.observe(this.canvas);
};

CanvasManager.prototype.visibilityChange = function(entries, obs) {
    'use strict';
    entries.forEach(
        e => {if(e.isIntersecting != this.isVisible) {
            console.log(e.isIntersecting)
            this.isVisible = e.isIntersecting;
            this.handleVisibilityChange();
        }} 
    );
}

CanvasManager.prototype.handleVisibilityChange = function() {
    'use strict';
    if (this.isVisible) 
        this.startScene();
    else this.stopScene();
}

CanvasManager.prototype.startScene = function() {
    'use strict';
    console.log('starting ' + this.options.key)
    this.sceneInstance = new this.sceneKey(this.options);
    this.sceneInstance.start();
}

CanvasManager.prototype.stopScene = function() {
    'use strict';
    console.log('stopping ' + this.options.key)
    this.sceneInstance.stop();
    delete(this.sceneInstance);
    this.sceneInstance = null;
}

CanvasManager.prototype.getCanvasSize = function () {
    'use strict';
    return new Vector2(this.canvas.clientWidth, this.canvas.clientHeight);
};

CanvasManager.prototype.resize = function () {
    'use strict';
    return this.size;
};

CanvasManager.prototype.stop = function () {
    'use strict';
    this.observer.unobserve();
};