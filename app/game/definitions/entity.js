(function(root) {

        var entities = {

                //
                // All entity definitions go here
                //

                player: {
                        width: 64, 
                        height: 48, 
                        speed: 12, 
                        components: {
                                Renderable: {
                                        color: '#5FDB00', 
                                        sprites: 'player'
                                }, 
                                Movable: {
                                        acceleration: 0.2
                                }, 
                                Collidable: {
                                        method: 'cross', 
                                        setup: {
                                                x: { x: 0, y: 8, width: 64, height: 32 }, 
                                                y: { x: 8, y: 0, width: 32, height: 48 }
                                        }
                                }, 
                                IsPlayer: {
                                }, 
                                Emitter: {
                                        particles: [{
                                                spawnOffset: { x: 24, y: 8 }, 
                                                rate: 50, 
                                                dir: { x: 1, y: 0 }, 
                                                ttl: 220, 
                                                startState: {
                                                        width: 24, 
                                                        height: 24, 
                                                        color: { r: 95, g: 219, b: 0 }, 
                                                        speed: 8
                                                }, 
                                                endState: {
                                                        width: 8, 
                                                        height: 8, 
                                                        color: { r: 210, g: 255, b: 191 }, 
                                                        speed: 8
                                                }
                                        }]
                                }, 
                                Hurtable: {
                                        health: 1, 
                                        onDeath: function() {
                                                App.Sound.play('death01');
                                                
                                                if(this.en.is('Emitter')) {
                                                        this.en.c('Emitter').disable();
                                                }

                                                App.Game.setGameState('gameover', function(){
                                                        App.Game.defaultDir = { x: 0, y: 1 };
                                                        if(App.Game.level >= App.Game.best.level) {
                                                                App.Game.best.level = App.Game.level;
                                                                if(App.Game.score >= App.Game.best.score) {
                                                                        App.Game.best.score = App.Game.score;
                                                                }
                                                        }
                                                        App.Saves.StatsSave.save();
                                                });
                                        }
                                }
                        }
                }, 

                camera: {
                        width: 32, 
                        height: 32, 
                        speed: 12, 
                        components: {
                                //Renderable: {
                                        //color: 'rgba(255,255,0,0.5)'
                                //},
                                Movable: {
                                        acceleration: 0.2
                                },
                                IsCamera: {
                                        behavior: function() {
                                                var player = App.World.getPlayer(0), 
                                                    pCenter = player.center(), 
                                                    cCenter = this.en.center(), 
                                                    xDir = 0,  
                                                    yDir = 0, 
                                                    newPos;

                                                if(cCenter.x > pCenter.x && cCenter.x - pCenter.x > this.en.attrs.width / 2) {
                                                        xDir = -1;
                                                } else if(cCenter.x < pCenter.x && pCenter.x - cCenter.x > this.en.attrs.width / 2) {
                                                        xDir = 1;
                                                }

                                                /*
                                                if(cCenter.y > pCenter.y && cCenter.y - pCenter.y > this.en.attrs.height / 2) {
                                                        yDir = -1;
                                                } else if(cCenter.y < pCenter.y && pCenter.y - cCenter.y > this.en.attrs.height / 2) {
                                                        yDir = 1;
                                                }
                                                */

                                                this.en.c('Movable').move(xDir, yDir);
                                        }
                                }
                        }
                }, 

                bullet: {
                        width: 16, 
                        height: 16, 
                        speed: 14, 
                        components: {
                                Renderable: {
                                        color: '#666666 '
                                }, 
                                Movable: {
                                }, 
                                Collidable: {
                                }, 
                                Projectile: {
                                }
                        }
                }, 

                particle: {
                        width: 0, 
                        height: 0, 
                        speed: 0, 
                        components: {
                                Renderable: {
                                        color: '#FFF'
                                },
                                Movable: {
                                        acceleration: 0.2
                                }, 
                                Collidable: {
                                }, 
                                Particle: {
                                }
                        }
                }
        };

        root.App.Defaults.Entity = entities;

})(this);
