(function(root) {

        var entities = {

                //
                // All entity definitions go here
                //

                player: {
                        width: 48, 
                        height: 48, 
                        speed: 12, 
                        components: {
                                Renderable: {
                                        color: '#5FDB00', 
                                        hasTrail: true, 
                                        trail: function() {
                                        }
                                }, 
                                Movable: {
                                        acceleration: 0.2
                                }, 
                                /*
                                Collidable: {
                                        method: 'cross', 
                                        setup: {
                                                x: { x: 0, y: 10, width: 48, height: 32 }, 
                                                y: { x: 10, y: 0, width: 32, height: 48 }
                                        }
                                }, 
                                */
                                IsPlayer: {
                                }, 
                                Hurtable: {
                                        health: 1, 
                                        onDeath: function() {
                                                App.Game.setGameState('gameover', function(){
                                                });
                                        }
                                },
                                HasProjectile: {
                                        name: 'bullet',
                                        rate: 50, 
                                        origin: { x: 24, y: 24 }
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
                }
        };

        root.App.Defaults.Entity = entities;

})(this);
