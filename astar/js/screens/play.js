game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
    
        // load a level
        me.levelDirector.loadLevel("area02");
    
        // reset the score
        game.data.score = 0;

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        
        //Get grid from "Map" layer
        game.level = me.levelDirector.getCurrentLevel();
        game.grid = [];

        var tmp_grid = game.level.data.layers.filter(a => a.name === "Map")[0].data;
        for(var i=0; i<tmp_grid.length/game.level.cols; i+=1) game.grid.push(tmp_grid.slice(i*game.level.cols,(i+1)*game.level.cols));

        game.start_point = game.level.objectGroups.filter(a => a.name === "Objects")[0].objects.filter(a => a.type === "start")[0]
        game.end_point = game.level.objectGroups.filter(a => a.name === "Objects")[0].objects.filter(a => a.type === "end")[0]
        
        var man = new game.PlayerEntity(game.start_point.x, game.start_point.y);
        me.game.world.addChild(man, 2);
        
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
