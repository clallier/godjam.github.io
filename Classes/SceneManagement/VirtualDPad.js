/*global Vector2, HTMLCanvasElement, Tools*/
// adapted from https://github.com/sebleedelisle/JSTouchController/blob/master/TouchControl.html
var VirtualDPad = function(canvas, callbackOwner, callback) {
    "use strict";

    if (canvas instanceof HTMLCanvasElement === false) {
        throw "MouseEvtListener.ctor : canvas is not a HTMLCanvasElement";
    }

    this.padState = {
        // direction pad
        d: new Vector2(0, 0),
        // action btn
        action: false
    };

    this.k = {
        left: 37,
        right: 39,
        up: 38,
        down: 40,
        space: 32
    };
    
    this.showOnStart = true;
    var v0 = new Vector2(100, canvas.height - 100);
    var v1 = new Vector2(canvas.width - 100, canvas.height - 100);

    this.supportTouch = ('ontouchstart' in window);
    this.leftTouchID = 0; // -1
    this.rightTouchID = 0; // -1
    this.leftTouchPos = v0.copy();
    this.leftTouchStartPos = v0.copy();
    this.rightTouchPos = v1.copy();


    this.canvas = canvas;
    this.callbackOwner = callbackOwner;
    this.callback = null;

    if (callback !== undefined && callback instanceof Function) {
        this.callback = callback;
    }

    // attach event listener to the doc (with capturing)
    if (this.supportTouch) {
        this.canvas.addEventListener("touchstart", this.touchStart.bind(this));
        this.canvas.addEventListener("touchend", this.touchEnd.bind(this));
        this.canvas.addEventListener("touchmove", this.touchMove.bind(this));
    }
    // keyboard
    window.addEventListener("keydown", this.keyDownListener.bind(this), true);
    window.addEventListener("keyup", this.keyUpListener.bind(this), true);
};

VirtualDPad.prototype.stop = function() {
    "use strict";
    if (this.supportTouch) {
        this.canvas.removeEventListener("touchstart", this.touchStart);
        this.canvas.removeEventListener("touchend", this.touchEnd);
        this.canvas.removeEventListener("touchmove", this.touchMove);
    }
    window.removeEventListener("keydown", this.keyDownListener);
    window.removeEventListener("keyup", this.keyUpListener);
};

VirtualDPad.prototype.update = function() {
    "use strict";

    if (this.callback !== null) {
        var f = this.callback.bind(this.callbackOwner);
        f(this.padState);
    }
};

VirtualDPad.prototype.touchStart = function(event) {
    "use strict";
    var i = 0,
        t = null;
    event.preventDefault();
    
    if (this.showOnStart === true) {
        this.showOnStart = false;
        this.leftTouchID = -1;
        this.rightTouchID = -1;
    }

    for (i = 0; i < event.changedTouches.length; i += 1) {
        t = event.changedTouches[i];
        
        if (this.leftTouchID < 0 && t.clientX < this.canvas.width / 2) {
            this.leftTouchID = t.identifier;
            this.leftTouchStartPos.x = this.leftTouchPos.x = t.clientX;
            this.leftTouchStartPos.y = this.leftTouchPos.y = t.clientY;
            this.padState.d.x = this.padState.d.y = 0;
            continue;
        }
        else if (this.rightTouchID < 0) {
            this.rightTouchID = t.identifier;
            this.rightTouchPos.x = t.clientX;
            this.rightTouchPos.y = t.clientY;
            this.padState.action = true;
            continue;
        }
    }
};


VirtualDPad.prototype.touchMove = function(event) {
    "use strict";
    var i = 0,
        t = null;
    event.preventDefault();

    for (i = 0; i < event.changedTouches.length; i += 1) {
        t = event.changedTouches[i];
        if (this.leftTouchID === t.identifier) {
            this.padState.d.x = (t.clientX - this.leftTouchStartPos.x) / 50;
            this.padState.d.y = (t.clientY - this.leftTouchStartPos.y) / 50;
            this.padState.d.limit(1);
            this.leftTouchPos.x = this.leftTouchStartPos.x + this.padState.d.x * 50;
            this.leftTouchPos.y = this.leftTouchStartPos.y + this.padState.d.y * 50;
            continue;
        }
        else if (this.rightTouchID === t.identifier) {
            this.rightTouchPos.x = t.clientX;
            this.rightTouchPos.y = t.clientY;
            this.padState.action = true;
            continue;
        }
    }
    this.update();
};

VirtualDPad.prototype.touchEnd = function(event) {
    "use strict";
    event.preventDefault();
    var i = 0,
        t = null;

    for (i = 0; i < event.changedTouches.length; i += 1) {
        t = event.changedTouches[i];
        
        if (this.leftTouchID === t.identifier) {
            this.leftTouchID = -1;
            this.padState.d.x = 0;
            this.padState.d.y = 0;
            break;
        }
        if (this.rightTouchID === t.identifier) {
            this.rightTouchID = -1;
            this.padState.action = false;
            break;
        }
    }

    this.update();
};

VirtualDPad.prototype.keyDownListener = function(event) {
    "use strict";
    if (event.defaultPrevented) {
        return; // Should do nothing if the key event was already consumed.
    }
    if (event.keyCode === this.k.up) {
        this.padState.d.y = -1;
    }
    if (event.keyCode === this.k.down) {
        this.padState.d.y = 1;
    }
    if (event.keyCode === this.k.left) {
        this.padState.d.x = -1;
    }
    if (event.keyCode === this.k.right) {
        this.padState.d.x = 1;
    }
    if (event.keyCode === this.k.space) {
        this.padState.action = true;
    }
    event.preventDefault();
    this.update();
};

VirtualDPad.prototype.keyUpListener = function(event) {
    "use strict";
    if (event.defaultPrevented) {
        return; // Should do nothing if the key event was already consumed.
    }
    if (event.keyCode === this.k.up || event.keyCode === this.k.down) {
        this.padState.d.y = 0;
    }
    if (event.keyCode === this.k.left || event.keyCode === this.k.right) {
        this.padState.d.x = 0;
    }
    if (event.keyCode === this.k.space) {
        this.padState.action = false;
    }
    event.preventDefault();
    this.update();
};

VirtualDPad.prototype.display = function(ctx) {
    "use strict";
    if (this.supportTouch === false) {
        return
    };
    // TODO replace 50 by a member + cyan
    var i = 0, 
        PI2 = 2 * Math.PI;

    if (this.leftTouchID > -1) {
        ctx.strokeStyle = "#889";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 50, 0, PI2);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.arc(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 55, 0, PI2);
        ctx.stroke();
        ctx.closePath();
                
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.leftTouchPos.x, this.leftTouchPos.y, 50, 0, PI2);
        ctx.stroke();
        ctx.closePath();
    }

    if (this.rightTouchID > -1) {
        ctx.beginPath();
        ctx.arc(this.rightTouchPos.x, this.rightTouchPos.y, 50, 0, PI2);
        ctx.stroke();
        ctx.closePath();
    }
}