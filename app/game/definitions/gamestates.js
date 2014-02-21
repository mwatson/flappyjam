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
                                                'VIRTUAL/BIRD', 
                                                App.Game.settings.hud.titleFont, 
                                                '#FFF', 
                                                53, 
                                                103
                                        );

                                        App.Draw.get('hud').writeText(
                                                'VIRTUAL/BIRD', 
                                                App.Game.settings.hud.titleFont, 
                                                App.Tools.rgbObjToColor(App.World.map.levelColors.main),  
                                                50, 
                                                100
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                '> FLAP TO BOOT BIRD', 
                                                App.Game.settings.hud.smallFont, 
                                                '#555555', 
                                                132, 
                                                242, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                '> FLAP TO BOOT BIRD', 
                                                App.Game.settings.hud.smallFont, 
                                                '#FFF', 
                                                130, 
                                                240, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'CONTROLS:|FLAP - (W) OR (UP ARROW)|Dive - (S) OR (DOWN ARROW)', 
                                                App.Game.settings.hud.smallFont, 
                                                '#555555', 
                                                82, 
                                                352, 
                                                32
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'CONTROLS:|FLAP - (W) OR (UP ARROW)|DIVE - (S) OR (DOWN ARROW)', 
                                                App.Game.settings.hud.smallFont, 
                                                '#D2FFBF', 
                                                80, 
                                                350, 
                                                32
                                        );
                                },

                                update: function() {

                                        if(App.Controls.keyDown('W') || App.Controls.keyDown('ARROW_UP')) {
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
                                        App.Defs.Huds.displayScore();
                                },

                                update: function() {
                                        App.Game.gameplayOps();

                                        if(App.Game.score >= App.World.map.numCols) {
                                                App.Game.setGameState('transition', function(){
                                                        App.Game.defaultDir = { x: 1, y: 0 };
                                                });
                                        }

                                        var xDir = 0, 
                                            yDir = 0, 
                                            newPos = {}, 
                                            player = App.World.getPlayer(0);

                                        xDir = App.Game.defaultDir.x;
                                        yDir = App.Game.defaultDir.y;

                                        if(player.c('Hurtable').isDead()) {
                                                yDir = 1;
                                                xDir = 0;
                                        }

                                        if(App.Controls.keyDown('W') || App.Controls.keyDown('ARROW_UP')) {
                                                yDir -= 2;
                                        }
                                        if(App.Controls.keyDown('S') || App.Controls.keyDown('ARROW_DOWN')) {
                                                yDir += 1;
                                        }

                                        newPos = player.c('Movable').move(xDir, yDir);

                                        if(!_.isUndefined(newPos.collisions) && newPos.collisions.length) {
                                                //player.c('Hurtable').takeDamage(1);
                                        }
                                }
                        }
                }, 

                transition: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Game.centerCamera(interpolation, moveDelta);

                                        App.Defs.Huds.displayScore();

                                        App.Draw.get('hud').writeText(
                                                'LEVEL_COMPLETE', 
                                                App.Game.settings.hud.largeFont, 
                                                '#FFF', 
                                                63, 
                                                203
                                        );

                                        App.Draw.get('hud').writeText(
                                                'LEVEL_COMPLETE', 
                                                App.Game.settings.hud.largeFont, 
                                                App.Tools.rgbObjToColor(App.World.map.levelColors.main), 
                                                60, 
                                                200
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GET READY_', 
                                                App.Game.settings.hud.normalFont, 
                                                '#245400', 
                                                222, 
                                                262
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GET READY_', 
                                                App.Game.settings.hud.normalFont, 
                                                '#FFF', 
                                                220, 
                                                260
                                        );
                                },

                                update: function() {
                                        App.Game.gameplayOps();

                                        App.World.getPlayer(0).c('Movable').move(
                                                App.Game.defaultDir.x, 
                                                App.Game.defaultDir.y
                                        );
                                }
                        }
                }, 

                gameover: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Game.centerCamera(interpolation, moveDelta);

                                        var level = (App.Game.level + 1) + '', 
                                            score = App.Game.score + '', 
                                            bLevel = (App.Game.best.level + 1) + '', 
                                            bScore = App.Game.best.score + '';

                                        App.Draw.get('hud').writeText(
                                                'GAME_OVER', 
                                                App.Game.settings.hud.largeFont, 
                                                '#FFF', 
                                                163, 
                                                203
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GAME_OVER', 
                                                App.Game.settings.hud.largeFont, 
                                                '#54C200', 
                                                160, 
                                                200
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'LEVEL: ' + level + '|SCORE: ' + score + '| BEST: L' + bLevel + ' S' + bScore, 
                                                App.Game.settings.hud.normalFont, 
                                                '#245400', 
                                                212, 
                                                252, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'LEVEL: ' + level + '|SCORE: ' + score + '| BEST: L' + bLevel + ' S' + bScore, 
                                                App.Game.settings.hud.normalFont, 
                                                '#FFF', 
                                                210, 
                                                250, 
                                                38
                                        );

                                        App.Draw.get('hud').writeText(
                                                'PRESS (R) TO REBOOT_', 
                                                App.Game.settings.hud.smallFont, 
                                                '#245400', 
                                                162, 
                                                402
                                        );

                                        App.Draw.get('hud').writeText(
                                                'PRESS (R) TO REBOOT_',
                                                App.Game.settings.hud.smallFont, 
                                                '#D2FFBF', 
                                                160, 
                                                400
                                        );
                                },

                                update: function() {

                                        App.Game.gameplayOps();

                                        App.World.getPlayer(0).c('Movable').move(
                                                App.Game.defaultDir.x, 
                                                App.Game.defaultDir.y
                                        );

                                        if(App.Controls.keyDown('R')) {
                                                App.Game.setGameState('gamestart', function(){ 
                                                        App.World.loadMap(0);
                                                        App.Game.score = 0;
                                                        App.Game.level = 1;
                                                });
                                        }
                                }
                        }
                }
        };

        root.App.Defaults.GameStates = gameStates;

})(this);
