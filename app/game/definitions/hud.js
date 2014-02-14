(function(root) {

        var huds = {

                displayScore: function() {
                        var level = App.Game.level + '', 
                            score = App.Game.score + '';

                        App.Draw.get('hud').writeTextRight(
                                level, 
                                App.Game.settings.hud.largeFont, 
                                '#245400', 
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
                                '#245400', 
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
                                '#245400', 
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
                                '#245400', 
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
                }

        };

        root.App.Defaults.Huds = huds;

})(this);