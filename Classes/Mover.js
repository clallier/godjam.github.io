/*global Vector2, Scene, Color*/
//*************************************************
function Mover(x, y, scene, m) {
    "use strict";
    
    if (scene instanceof Scene === false) {
        throw "Mover.constructor: scene is not a Scene";
    }
    
    if (m === undefined) {
        m = 10;
    }
    
    this.location = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.acceleration = new Vector2(0, 0);
    this.mass = m;
    this.worldW = scene.width;
    this.worldH = scene.height;
    
    this.p1 = new Vector2(-1, -1);
    this.p2 = new Vector2(-1, 1);
    this.p3 = new Vector2(1, 1);
    this.p4 = new Vector2(1, -1);

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.useAngularAcceleration = false;
    this.color = Color.createBrightColor().ToHex();
}

Mover.prototype.initRandomly = function () {
    "use strict";
    this.location = new Vector2(
        Math.random() * this.worldW,
        Math.random() * this.worldH
    );
    this.velocity = new Vector2(
        Math.random() * 6 - 3,
        Math.random() * 6 - 3
    );
    this.mass = this.mass / 2 + Math.random() * this.mass / 2;
};

Mover.prototype.update = function (collideWithBorders) {
    "use strict";
    this.velocity.addInPlace(this.acceleration);
    this.velocity.limit(10);
    this.location.addInPlace(this.velocity);

    // if the angularAcceleration is in use 
    if (this.useAngularAcceleration === true) {
        this.angularVelocity += this.angularAcceleration;
        this.angle += this.angularVelocity;
    } else {
        // default : set angle according to the velocity
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
    }
    
    this.acceleration.multInPlace(0); // reset accel (force are applied)
    this.angularAcceleration = 0;
    if (collideWithBorders === true) { this.checkEdge(); }
};

Mover.prototype.displayAsCircle = function (ctx) {
    "use strict";
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.mass / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Mover.prototype.display = function (ctx) {
	"use strict";
    
    var o = new Vector2(0, 0),
        scale = this.mass,
        l1 = this.p1.rotate(this.angle, o),
        l2 = this.p2.rotate(this.angle, o),
        l3 = this.p3.rotate(this.angle, o),
        l4 = this.p4.rotate(this.angle, o);
    l1.multInPlace(scale);
    l2.multInPlace(scale);
    l3.multInPlace(scale);
    l4.multInPlace(scale);
    
    l1.addInPlace(this.location);
    l2.addInPlace(this.location);
    l3.addInPlace(this.location);
    l4.addInPlace(this.location);
    
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(l1.x, l1.y);
    ctx.lineTo(l2.x, l2.y);
    ctx.lineTo(l3.x, l3.y);
    ctx.lineTo(l4.x, l4.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

};

Mover.prototype.checkEdge = function () {
	"use strict";
    if (this.location.x + this.mass / 2 > this.worldW) {
        this.velocity.x *= -1;
        this.location.x = this.worldW - this.mass / 2;
    }
    if (this.location.x - this.mass / 2 < 0) {
        this.velocity.x *= -1;
        this.location.x = this.mass / 2;
    }
    if (this.location.y + this.mass / 2 > this.worldH) {
        this.velocity.y *= -1;
        this.location.y = this.worldH - this.mass / 2;
    }
    if (this.location.y - this.mass / 2 < 0) {
        this.velocity.y *= -1;
        this.location.y = this.mass / 2;
    }
};

/*
 * ApplyRotation
 */
Mover.prototype.applyTorque = function (angularAcceleration) {
	"use strict";
    if (typeof angularAcceleration !== 'number') {
        throw "Vector2.applyTorque : param 1 is not a scalar";
    }
    this.useAngularAcceleration = true;
    var appliedForce = angularAcceleration / this.mass;
    this.angularAcceleration += appliedForce;
};


/*
 * Newton second law
 * Apply a force dependant from mass 
 * Two object with different mass will undergo the same force differently
 * ie : two objects with different mass will undergo the wind differently 
 */
Mover.prototype.applyForce = function (force) {
	"use strict";
    if (force instanceof Vector2 === false) {
        throw "Mover.applyForce : param is not a Vector2";
    }
    var appliedForce = force.div(this.mass);
    this.acceleration.addInPlace(appliedForce);
};

/*
 * Newton second law
 * Apply a force independant from mass 
 * Two object with different mass will undergo the same force the same way 
 * ie : two objects with different mass will undergo the gravity the same way
 */
Mover.prototype.applyUniformForce = function (force) {
	"use strict";
    if (force instanceof Vector2 === false) {
        throw "Mover.applyForce : param is not a Vector2";
    }
    this.acceleration.addInPlace(force);
};

/*
 *  Attract another Mover
 */
Mover.prototype.attract = function (mover, G) {
	"use strict";
    if (mover instanceof Mover === false) {
        throw "Mover.attract : param is not another Mover";
    }
    
    if (G === undefined) {
        G = 1;
    }
    
    var force = this.location.sub(mover.location), // diff
        dist = force.mag(),
        strength = 0;
        
    force.normalizeInPlace();
    if (dist < 5) { dist = 5; }
    if (dist > 10) { dist = 10; }
    strength = (G * dist * dist) / (this.mass * this.mass);
    force.multInPlace(strength);
    mover.applyForce(force);
};