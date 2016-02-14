/*global Scene, Mover, Gravity, RandomForce*/
var HeliumBalloonScene = function () {
    "use strict";
    this.intro("Helium Balloons");

    Scene.call(this);
    var i = 0,
        max = Math.max(8, this.size.x / 10);
    this.ballons = [];
    for (i = 0; i < max; i += 1) {
        this.ballons[i] = new Mover(0, 0, this, 20);
        this.ballons[i].initRandomly();
    }
    this.gravity = new Gravity(0, -0.005);
    this.wind = new RandomForce(true);

};
HeliumBalloonScene.prototype = Object.create(Scene.prototype);
HeliumBalloonScene.prototype.constructor =  HeliumBalloonScene;

HeliumBalloonScene.prototype.loop = function () {
    "use strict";
    var i = 0;
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);

    // update
    for (i = 0; i < this.ballons.length; i += 1) {
        this.wind.applyOn(this.ballons[i]);
        this.gravity.applyOn(this.ballons[i]);
        this.ballons[i].update(1);

        // draw
        this.ballons[i].displayAsCircle(this.ctx);
    }
    Scene.prototype.loop.call(this);
};