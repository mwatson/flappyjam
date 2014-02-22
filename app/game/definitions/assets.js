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
                        { name: 'player_base00', rel: 'img/player/playerbase_1_0.png' }, 
                        { name: 'player_base01', rel: 'img/player/playerbase_1_1.png' }, 
                        { name: 'player_base02', rel: 'img/player/playerbase_1_2.png' }, 
                        { name: 'player_wing01', rel: 'img/player/playerwing_1_1.png' }, 
                        { name: 'player_wing02', rel: 'img/player/playerwing_1_2.png' }, 
                        { name: 'player_wing03', rel: 'img/player/playerwing_1_3.png' }
                ], 

                CompositeImages: [

                        //
                        // Player
                        //
                        { name: 'player_idle_frame01', 
                          images: [ 
                                { frame: 'player_base00', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_wing02', offset: { x: 0, y: 0 } }
                          ]
                        }, 
                        { name: 'player_dead_frame01', 
                          images: [ 
                                { frame: 'player_base02', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_wing01', offset: { x: 0, y: 4 } }
                          ]
                        }, 
                        { name: 'player_right_frame01',
                          images: [ 
                                { frame: 'player_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_wing01', offset: { x: 0, y: 0 } }
                          ]
                        },
                        { name: 'player_right_frame02',
                          images: [ 
                                { frame: 'player_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_wing02', offset: { x: 0, y: 0 } }
                          ]
                        },
                        { name: 'player_right_frame03',
                          images: [ 
                                { frame: 'player_base01', offset: { x: 0, y: 0 } }, 
                                { frame: 'player_wing03', offset: { x: 0, y: 0 } }
                          ]
                        },
                ], 

                Sounds: [
                        { name: 'death01', rel: 'sound/death.wav' }
                ], 

                SoundQueues: [
                ], 

                Music: [

                        { name: 'pumped', rel: { mp3: 'music/roccow_pumped.mp3' } }
                ]
        };

        root.App.Defaults.Assets = assets;

})(this);
