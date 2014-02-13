(function(root) {

        var gameStates = {

                loading: {

                        tick: {
                                draw: function() {
                                },

                                update: function() {
                                        App.Tools.assetFontCheck();
                                        if(App.Defs.Assets.Loaded.Complete) {
                                                App.Game.setGameState('gamestart');
                                        }
                                }
                        }
                }, 

                gamestart: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Game.centerCamera(interpolation, moveDelta);

                                        App.Draw.get('hud').writeText(
                                                'VIRTUAL BIRD', 
                                                App.Game.settings.hud.titleFont, 
                                                '#FFF', 
                                                53, 
                                                103
                                        );

                                        App.Draw.get('hud').writeText(
                                                'VIRTUAL BIRD', 
                                                App.Game.settings.hud.titleFont, 
                                                '#54C200', 
                                                50, 
                                                100
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'A CYBERPUNK THRILLER', 
                                                App.Game.settings.hud.normalFont, 
                                                '#245400', 
                                                72, 
                                                152, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'A CYBERPUNK THRILLER', 
                                                App.Game.settings.hud.normalFont, 
                                                '#FFF', 
                                                70, 
                                                150, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'Controls:|Flap - W or Up Arrow|Dive - S or Down Arrow', 
                                                App.Game.settings.hud.smallFont, 
                                                '#245400', 
                                                112, 
                                                352, 
                                                32
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'Controls:|Flap - W or Up Arrow|Dive - S or Down Arrow', 
                                                App.Game.settings.hud.smallFont, 
                                                '#D2FFBF', 
                                                110, 
                                                350, 
                                                32
                                        );
                                },

                                update: function() {

                                        if(
                                                App.Controls.keyDown('W') || App.Controls.keyDown('ARROW_UP') || 
                                                App.Controls.keyDown('S') || App.Controls.keyDown('ARROW_DOWN')
                                        ) {
                                                App.Game.setGameState('gameplay', function(){
                                                        App.Game.defaultDir = { x: 1, y: 1 };
                                                });
                                        }
                                }
                        }
                }, 

                gameplay: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Game.centerCamera(interpolation, moveDelta);
                                },

                                update: function() {
                                        App.Game.gameplayOps();
                                }
                        }
                }, 

                gameover: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Game.centerCamera(interpolation, moveDelta);

                                        App.Draw.get('hud').writeText(
                                                'GAME OVER', 
                                                App.Game.settings.hud.largeFont, 
                                                '#FFF', 
                                                163, 
                                                203
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GAME OVER', 
                                                App.Game.settings.hud.largeFont, 
                                                '#54C200', 
                                                160, 
                                                200
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'SCORE: 0| BEST: 0', 
                                                App.Game.settings.hud.normalFont, 
                                                '#245400', 
                                                212, 
                                                252, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'SCORE: 0| BEST: 0', 
                                                App.Game.settings.hud.normalFont, 
                                                '#FFF', 
                                                210, 
                                                250, 
                                                38
                                        );

                                        App.Draw.get('hud').writeText(
                                                'Press R to Restart', 
                                                App.Game.settings.hud.smallFont, 
                                                '#245400', 
                                                162, 
                                                402
                                        );

                                        App.Draw.get('hud').writeText(
                                                'Press R to Restart', 
                                                App.Game.settings.hud.smallFont, 
                                                '#D2FFBF', 
                                                160, 
                                                400
                                        );
                                },

                                update: function() {

                                        App.Game.gameplayOps();

                                        if(App.Controls.keyDown('R')) {
                                                App.Game.setGameState('gamestart', function(){ 
                                                        App.World.loadMap(0);
                                                });
                                        }
                                }
                        }
                }
        };

        root.App.Defaults.GameStates = gameStates;

})(this);
