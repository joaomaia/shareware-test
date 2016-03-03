/**
 * main
 */
var game = {

    /**
     *
     * Initialize the application
     */
    onload: function() {

        // init the video
        if (!me.video.init(960, 540, {wrapper : "screen", scale : "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Set some default debug flags
        me.debug.renderHitBox = true;

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // load pathfinding plugin
        me.plugin.register.defer(this, me.pathfinding.EasyStar, "easystar");

        // set all ressources to be loaded
        me.loader.onload = this.loaded.bind(this);

        // set all ressources to be loaded
        me.loader.preload(game.resources);

        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
    },


    /**
     * callback when everything is loaded
     */
    loaded: function ()    {

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // set the fade transition effect
        me.state.transition("fade","#FFFFFF", 250);

        // register our objects entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("Enemy", game.EnemyEntity);

        // create and setup static collision mesh
        // TODO update grid if collision mesh changes (change level, new objects, etc)

        var collisionObjects = me.levelDirector.getCurrentLevel().getObjects(true).filter(function(o){
            return o.type == 'solid';
        });
        var grid = [];
        for (var y = 0; y < me.levelDirector.getCurrentLevel().rows; y++) {
            grid.push([]);
            for (var x = 0; x < me.levelDirector.getCurrentLevel().cols; x++) {
                for (var o = 0; o < collisionObjects.length; o++) {
                    var test = new me.Renderable(x * me.levelDirector.getCurrentLevel().tilewidth, y * me.levelDirector.getCurrentLevel().tileheight, me.levelDirector.getCurrentLevel().tilewidth, me.levelDirector.getCurrentLevel().tileheight);
                    if(test.overlaps(collisionObjects[o])){
                        //console.log('collision at: ' + x*me.levelDirector.getCurrentLevel().tilewidth + ' , ' + y*me.levelDirector.getCurrentLevel().tileheight);
                        grid[y][x] = 1;
                    } else{
                        grid[y][x] = 0;
                    }
                }
            }
        }
        me.plugins.easystar.setGrid(grid);
        me.plugins.easystar.setAcceptableTiles([0]);

        // switch to PLAY state
        me.state.change(me.state.PLAY);
    }
};
