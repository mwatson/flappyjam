(function(root) {

        var gameStates = {

                all: {
                        tick: {
                                draw: function() {
                                }, 

                                update: function() {
                                        if(App.Controls.keyPress('M')) {
                                                App.Sound.toggleMuteSong('pumped');
                                        }
                                }
                        }
                }, 

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
                                        App.Defs.Huds.titleScreen();
                                },

                                update: function() {

                                        if(App.Controls.keyDown('W') || App.Controls.keyDown('ARROW_UP')) {
                                                App.Game.setGameState('gameplay', function(){
                                                        App.Sound.playSong('pumped', true);
                                                        App.Game.defaultDir = { x: 1, y: 1 };
                                                });

                                        } else if(App.Controls.keyPress('SPACE')) {
                                                App.Game.setGameState('gameinfo', function(){
                                                });
                                        }
                                }
                        }
                }, 

                gameinfo: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Defs.Huds.gameInfo();
                                }, 

                                update: function() {

                                        if(App.Controls.keyPress('SPACE')) {
                                                App.Game.setGameState('gamestart', function(){
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

                                        delete newPos;
                                }
                        }
                }, 

                transition: {

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Game.centerCamera(interpolation, moveDelta);

                                        App.Defs.Huds.displayScore();

                                        App.Draw.get('hud').writeText(
                                                'LEVEL/COMPLETE', 
                                                App.Game.settings.hud.largeFont, 
                                                '#FFF', 
                                                63, 
                                                203
                                        );

                                        App.Draw.get('hud').writeText(
                                                'LEVEL/COMPLETE', 
                                                App.Game.settings.hud.largeFont, 
                                                App.Tools.rgbObjToColor(App.World.map.levelColors.main), 
                                                60, 
                                                200
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GET READY', 
                                                App.Game.settings.hud.normalFont, 
                                                '#245400', 
                                                232, 
                                                262
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GET READY', 
                                                App.Game.settings.hud.normalFont, 
                                                '#FFF', 
                                                230, 
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
                                                'GAME/OVER', 
                                                App.Game.settings.hud.largeFont, 
                                                '#FFF', 
                                                163, 
                                                153
                                        );

                                        App.Draw.get('hud').writeText(
                                                'GAME/OVER', 
                                                App.Game.settings.hud.largeFont, 
                                                '#54C200', 
                                                160, 
                                                150
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'LEVEL: ' + level + '|SCORE: ' + score + '| BEST: L' + bLevel + ' S' + bScore, 
                                                App.Game.settings.hud.normalFont, 
                                                '#245400', 
                                                212, 
                                                202, 
                                                38
                                        );

                                        App.Draw.get('hud').writeTextMultiLine(
                                                'LEVEL: ' + level + '|SCORE: ' + score + '| BEST: L' + bLevel + ' S' + bScore, 
                                                App.Game.settings.hud.normalFont, 
                                                '#FFF', 
                                                210, 
                                                200, 
                                                38
                                        );

                                        App.Draw.get('hud').writeText(
                                                'PRESS     TO REBOOT', 
                                                App.Game.settings.hud.smallFont, 
                                                '#245400', 
                                                162, 
                                                392
                                        );

                                        App.Draw.get('hud').writeText(
                                                'PRESS     TO REBOOT',
                                                App.Game.settings.hud.smallFont, 
                                                '#D2FFBF', 
                                                160, 
                                                390
                                        );

                                        App.Defs.Huds.drawHudKey(275, 370, 'R', 8, 26);
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
                                                        App.Game.level = 0;
                                                });
                                        }
                                }
                        }
                }
        };

        root.App.Defaults.GameStates = gameStates;

})(this);
