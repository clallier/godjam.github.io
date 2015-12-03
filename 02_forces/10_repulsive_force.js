/*global Scene, Mover, MouseAttractor, Attractor*/
//*************************************************
var RepulsiveMoversScene = function () {
	"use strict";
    Scene.call(this);
    var i = 0,
        w = this.width,
        h = this.height,
        s = 0,
        attractor = new Attractor(0, 0, 30, 20);
    this.movers = [];
    this.gravity = new MouseAttractor(this, attractor);
    
    for (i = 0; i < 70; i += 1) {
        s = Math.random() * 20 + 10;
        this.movers[i] = new Mover(0, 0, w, h, s);
        this.movers[i].initRandomly();
    }
};
RepulsiveMoversScene.prototype = Object.create(Scene.prototype);
RepulsiveMoversScene.prototype.constructor = RepulsiveMoversScene;
    
RepulsiveMoversScene.prototype.loop = function () {
    "use strict";
    this.ctx.clearRect(0, 0, this.width, this.height);
    var i = 0, j = 0;
    for (i = 0; i < this.movers.length; i += 1) {
        for (j = 0; j < this.movers.length; j += 1) {
            if (i !== j) {
                this.movers[i].attract(this.movers[j], -1);
            }
        }
        
        this.gravity.applyOn(this.movers[i]);
        this.movers[i].update(true);
        this.movers[i].display(this.ctx);
    }
    this.gravity.display(this.ctx);
    Scene.prototype.loop.call(this);
};