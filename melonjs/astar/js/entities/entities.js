/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, target_x, target_y) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {width : 32, height : 32}]);
        
        this.renderable = new me.AnimationSheet(0, 0, {
            image : "man",
            framewidth : 32,
            frameheight : 32,
            anchorPoint : new me.Vector2d(0.5, 0.5)
        });
        
        this.renderable.addAnimation ("idle", [0]);
        
        this.renderable.setCurrentAnimation("idle");
        
        this.body.setVelocity(2, 2);
        this.body.vel.x = 0;
        this.body.vel.y = 0;

        this.path;
        this.next;      

     },

    /**
     * update the entity
     */
    update : function (dt) {

        if(this.path === undefined) {
          console.log(game.grid);
          me.plugins.easystar.setGrid(game.grid || [0]);
          me.plugins.easystar.setAcceptableTiles([0]);
          me.plugins.easystar.findPath((this.pos.x/32)|0, (this.pos.y/32)|0, (game.end_point.x/32)|0, (game.end_point.y/32)|0, (function(path) {
            this.path = path;
          }).bind(this));
          
          me.plugins.easystar.calculate();
        }
        
        //Check the path
        if(this.path) {

          // Got places to go
          if(this.path.length > 0){
          
            //Next destination
            if(!this.next) {
              console.log(this.path);
              this.next = this.path.shift();
              this.next.x *= 32;
              this.next.y *= 32;
              
              console.log(this.next);
              console.log(this.pos);
            }
       
            var distx = this.next.x - this.pos.x;
            var disty = this.next.y - this.pos.y;

            if(Math.abs(distx) < 1 && Math.abs(disty) < 1) {
              this.next = this.path.shift();
              this.next.x *= 32;
              this.next.y *= 32;
              distx = this.next.x - this.pos.x;
              disty = this.next.y - this.pos.x;
            }
            
            var dist = 0.2 * Math.sqrt((distx*distx) + (disty*disty));
            
            this.body.vel.x = distx/dist;
            this.body.vel.y = disty/dist;

          } else {
            // Stop

            this.body.vel.x = 0;
            this.body.vel.y = 0;

          }

        }
        

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        //me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});
