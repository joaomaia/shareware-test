
/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PlayerEntity = me.Entity.extend({

    init : function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        // disable gravity
        this.body.gravity = 0;

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");

        // create a new animationSheet object
        this.renderable = new me.AnimationSheet(0, 0, {
            image : "player",
            framewidth : 32,
            frameheight : 64,
            anchorPoint : new me.Vector2d(0.5, 1)
        });

        // define basic walking animation
        this.renderable.addAnimation ("idle", [10]);
        this.renderable.addAnimation ("walk_left", [24,25,26,27,28,29,30,31]);
        this.renderable.addAnimation ("walk_right", [16,17,18,19,20,21,22,23]);
        this.renderable.addAnimation ("walk_up", [0,1,2,3,4]);
        this.renderable.addAnimation ("walk_down", [8,9,10,11,12]);
        this.renderable.setCurrentAnimation("idle");
    },

    /* -----

        update the player pos and animations

    ------            */
    update : function (dt) {

        var left = right = up = down = false;

        if (me.input.isKeyPressed("left")) {
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            right = false;
            left = true;
        } else if (me.input.isKeyPressed("right")) {
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            left = false;
            right = true;
        } else {
            this.body.vel.x = 0;
            right = false;
            left = false;
        }
        if (me.input.isKeyPressed("up")) {
            // update the entity velocity
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            down = false;
            up = true;
        } else if (me.input.isKeyPressed("down")) {
            // update the entity velocity
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            up = false;
            down = true;
        } else {
            this.body.vel.y = 0;
            up = false;
            down = false;
        }

        // update animation
        if(left || right || up || down) {
            if(left || right){
                if(left && !this.renderable.isCurrentAnimation("walk_left")) this.renderable.setCurrentAnimation("walk_left");
                if(right && !this.renderable.isCurrentAnimation("walk_right")) this.renderable.setCurrentAnimation("walk_right");
            } else {
                if(up && !this.renderable.isCurrentAnimation("walk_up"))  this.renderable.setCurrentAnimation("walk_up");
                if(down && !this.renderable.isCurrentAnimation("walk_down")) this.renderable.setCurrentAnimation("walk_down");
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }


        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        } else{
            this.renderable.setCurrentAnimation("idle");
            return true;
        }
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (/*response, other*/) {
        // Make all other objects solid
        return true;
    }
});

/************************************************************************************/
/*                                                                                  */
/*        an enemy entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.EnemyEntity = me.Entity.extend({

    init : function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        // disable gravity
        this.body.gravity = 0;

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        // create a new animationSheet object
        this.renderable = new me.AnimationSheet(0, 0, {
            image : "enemy",
            framewidth : 32,
            frameheight : 64,
            anchorPoint : new me.Vector2d(0.5, 0.5)
        });

        // define basic walking animation
        this.renderable.addAnimation ("dead", [5]);
        this.renderable.addAnimation ("idle", [10]);
        this.renderable.addAnimation ("walk_left", [24,25,26,27,28,29,30,31]);
        this.renderable.addAnimation ("walk_right", [16,17,18,19,20,21,22,23]);
        this.renderable.addAnimation ("walk_up", [0,1,2,3,4]);
        this.renderable.addAnimation ("walk_down", [8,9,10,11,12]);
        this.renderable.setCurrentAnimation("idle");
    },


    /* -----

        update the enemy pos and animations

    ------            */
    update : function (dt) {


        // TODO calculate these
        var left = right = up = down = false;

        if (this.alive) {


            /**

            NEEDS PATHFINDING LOCIC

            **/
            
        } else {
            this.body.vel.x = 0;
            this.renderable.setCurrentAnimation("dead")
        }

        // update animation
        if(left || right || up || down) {
            if(left || right){
                if(left && !this.renderable.isCurrentAnimation("walk_left")) this.renderable.setCurrentAnimation("walk_left");
                if(right && !this.renderable.isCurrentAnimation("walk_right")) this.renderable.setCurrentAnimation("walk_right");    
            } else {
                if(up && !this.renderable.isCurrentAnimation("walk_up"))  this.renderable.setCurrentAnimation("walk_up");
                if(down && !this.renderable.isCurrentAnimation("walk_down")) this.renderable.setCurrentAnimation("walk_down");
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }
        

        // update the body movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (/*response, other*/) {
        // Make all other objects solid
        return true;
    }
});