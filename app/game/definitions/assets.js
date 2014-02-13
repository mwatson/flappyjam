(function(root){

        var assets = {

                Loaded: {
                        Complete: false, 
                        Images: 0, 
                        CompositeImages: 0, 

                        Sounds: 0, 
                        Fonts: 0
                }, 

                Fonts: [
                        { name: 'PCSenior' }
                ], 

                Images: [
                        { name: 'player_base01', rel: 'img/player/player_1_1.png' }, 
                        { name: 'player_shades01', rel: 'img/player/greenshades_1_1.png' }, 

                        { name: 'grunt_base01', rel: 'img/gruntdrop/base01.png' },
                        { name: 'grunt_shades01', rel: 'img/gruntdrop/shades.png' },

                        { name: 'shadow_64', rel: 'img/shadow01.png' }, 

                        { name: 'crosshair01', rel: 'img/crosshair01.png' }
                ], 

                CompositeImages: [

                        //
                        // Player
                        //
                        { name: 'player_idle_frame01', 
                          images: [ 
                                { frame: 'player_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_shades01', offset: { x: 4, y: 16 } }
                          ]
                        }, 
                        { name: 'player_right_frame01', // walking right
                          images: [ 
                                { frame: 'player_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_shades01', offset: { x: 8, y: 16 } }
                          ]
                        },
                        { name: 'player_left_frame01', // walking left
                          images: [ 
                                { frame: 'player_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_shades01', offset: { x: 0, y: 16 } }
                          ]
                        },

                        //
                        // Gruntdrop
                        //
                        { name: 'grunt_idle_frame01', 
                          images: [ 
                                { frame: 'grunt_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'grunt_shades01', offset: { x: 8, y: 16 } }
                          ]
                        }, 
                        { name: 'grunt_right_frame01', 
                          images: [ 
                                { frame: 'grunt_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'grunt_shades01', offset: { x: 12, y: 16 } }
                          ]
                        },
                        { name: 'grunt_left_frame01', 
                          images: [ 
                                { frame: 'grunt_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'grunt_shades01', offset: { x: 4, y: 16 } }
                          ]
                        },
                ], 

                Sounds: [
                ], 

                SoundQueues: [
                ]
        };

        root.App.Defaults.Assets = assets;

})(this);
