(function(root){

        var sprites = {

                player: {
                        idle: [
                                { frame: 'player_idle_frame01', duration: 300 }
                        ], 
                        walkRight: [
                                { frame: 'player_right_frame01', duration: 300 }
                        ], 
                        walkLeft: [
                                { frame: 'player_left_frame01', duration: 300 }
                        ]
                }, 

                grunt: {
                        idle: [
                                { frame: 'grunt_idle_frame01', duration: 300 }
                        ], 
                        walkRight: [
                                { frame: 'grunt_right_frame01', duration: 300 }
                        ], 
                        walkLeft: [
                                { frame: 'grunt_left_frame01', duration: 300 }
                        ]
                }
        }

        root.App.Defaults.Sprites = sprites;

})(this);
