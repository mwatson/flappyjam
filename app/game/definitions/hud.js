(function(root) {

        var huds = {

                displayScore: function() {
                        var level = (App.Game.level + 1) + '', 
                            score = App.Game.score + '';

                        App.Draw.get('hud').writeTextRight(
                                level, 
                                App.Game.settings.hud.largeFont, 
                                '#555555', 
                                303, 
                                83
                        );

                        App.Draw.get('hud').writeTextRight(
                                level, 
                                App.Game.settings.hud.largeFont, 
                                '#FFF', 
                                300, 
                                80
                        );

                        App.Draw.get('hud').writeTextRight(
                                'LEVEL', 
                                App.Game.settings.hud.smallFont, 
                                '#555555', 
                                302, 
                                32, 
                                38
                        );

                        App.Draw.get('hud').writeTextRight(
                                'LEVEL', 
                                App.Game.settings.hud.smallFont, 
                                '#FFF', 
                                300, 
                                30, 
                                38
                        );


                        App.Draw.get('hud').writeTextLeft(
                                score, 
                                App.Game.settings.hud.largeFont, 
                                '#555555', 
                                343, 
                                83
                        );

                        App.Draw.get('hud').writeTextLeft(
                                score, 
                                App.Game.settings.hud.largeFont, 
                                '#FFF', 
                                340, 
                                80
                        );

                        App.Draw.get('hud').writeTextLeft(
                                'SCORE', 
                                App.Game.settings.hud.smallFont, 
                                '#555555', 
                                342, 
                                32, 
                                38
                        );

                        App.Draw.get('hud').writeTextLeft(
                                'SCORE', 
                                App.Game.settings.hud.smallFont, 
                                '#FFF', 
                                340, 
                                30, 
                                38
                        );
                }, 

                titleScreen: function() {

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
                                '> SPACEBAR FOR GAME INFO|> FLAP TO BOOT BIRD', 
                                App.Game.settings.hud.smallFont, 
                                '#555555', 
                                132, 
                                182, 
                                38
                        );

                        App.Draw.get('hud').writeTextMultiLine(
                                '> SPACEBAR FOR GAME INFO|> FLAP TO BOOT BIRD',  
                                App.Game.settings.hud.smallFont, 
                                '#FFF', 
                                130, 
                                180, 
                                38
                        );

                        App.Draw.get('hud').writeTextMultiLine(
                                'CONTROLS:||FLAP      DIVE      MUTE', 
                                App.Game.settings.hud.smallFont, 
                                '#555555', 
                                42, 
                                322, 
                                34
                        );

                        App.Draw.get('hud').writeTextMultiLine(
                                'CONTROLS:||FLAP      DIVE      MUTE', 
                                App.Game.settings.hud.smallFont, 
                                '#D2FFBF', 
                                40, 
                                320, 
                                34
                        );

                        App.Defs.Huds.drawHudKey(140, 370, 'W', 8, 26);
                        App.Defs.Huds.drawHudKey(330, 370, 'S', 10, 26);
                        App.Defs.Huds.drawHudKey(520, 370, 'M', 8, 26);
                }, 

                gameInfo: function() {

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

                        var credits = 
                                '> A GAME BY MIKE WATSON|' + 
                                '>  mantiseyelabs.com|' + 
                                '>|' + 
                                '> MUSIC TRACK:|' + 
                                '>  "PUMPED" BY ROCCOW|' + 
                                '>   http://|' + 
                                '>|' + 
                                '> SPACEBAR TO RETURN|';

                        App.Draw.get('hud').writeTextMultiLine(
                                credits,  
                                App.Game.settings.hud.smallFont, 
                                '#555555', 
                                132, 
                                152, 
                                38
                        );

                        App.Draw.get('hud').writeTextMultiLine(
                                credits, 
                                App.Game.settings.hud.smallFont, 
                                '#FFF', 
                                130, 
                                150, 
                                38
                        );
                }, 

                // helper function
                drawHudKey: function(x, y, letter, textX, textY) {

                        App.Draw.get('hud').fillRect(x + 4, y - 4, 48, 64, '#555555');
                        App.Draw.get('hud').fillRect(x - 4, y + 4, 64, 48, '#555555');

                        App.Draw.get('hud').fillRect(x, y - 8, 48, 64, '#D2FFBF');
                        App.Draw.get('hud').fillRect(x - 8, y, 64, 48, '#D2FFBF');

                        App.Draw.get('hud').writeTextCenter(
                                letter, 
                                App.Game.settings.hud.largeFont, 
                                '#000', 
                                x + textX, 
                                y + textY
                        );
                }

        };

        root.App.Defaults.Huds = huds;

})(this);