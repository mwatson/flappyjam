(function(root){

        var sprites = {

                player: {
                        idle: [
                                { frame: 'player_idle_frame01', duration: 300 }
                        ], 
                        walkRight: [
                                { frame: 'player_right_frame01', duration: 200 }, 
                                { frame: 'player_right_frame02', duration: 100 }, 
                                { frame: 'player_right_frame03', duration: 200 }, 
                                { frame: 'player_right_frame02', duration: 100 }
                        ], 
                        dead: [
                                { frame: 'player_dead_frame01', duration: 300 }
                        ]
                }
        }

        root.App.Defaults.Sprites = sprites;

})(this);
