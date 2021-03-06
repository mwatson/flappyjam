(function(root){
        var game = function() {
                
                var self = this;

                // for node-webkit
                this.win = null;

                this.platform = 'web';

                var gameRunning = false, 
                    loopDelay = 0;

                this.settings = {};

                this.seed = null;

                this.init = function(settings) {
        
                        this.settings = settings.game;

                        if(typeof require != 'undefined') {
                                var gui = require('nw.gui');
                                this.win = gui.Window.get();
                        }

                        // seedings
                        this.seed = Math.seedrandom();
                        
                        // initialize game objects
                        App.Tools       = new App.Objects.Tools();
                        App.Definitions = new App.Objects.Definitions();
                        App.Storage     = new App.Objects.Storage();
                        App.Draw        = new App.Objects.Draw(settings.draw);
                        App.Sound       = new App.Objects.Sound(settings.sound);
                        App.Controls    = new App.Objects.Controls();
                        App.Player      = new App.Objects.Player(settings.player);
                        App.World       = new App.Objects.World(settings.world);

                        // initalize transitions
                        App.Draw.initTransitions();

                        // init player
                        App.Player.init();

                        // init savefile
                        App.Saves = {};
                        App.Saves.StatsSave  = new App.Objects.SaveFile(App.Defs.Saves_StatsSave);

                        // load stats
                        App.Saves.StatsSave.load();

                        // Load assets
                        App.Tools.assetLoader();

                        gameRunning = true;

                        this.skipTicks = ~~(1000 / this.settings.updatecap);

                        // start the game
                        this.gameLoop();
                };

                this.setFPSCap = function(cap) {
                        this.settings.fpscap = cap;
                        loopDelay = ~~(1000 / this.settings.fpscap);
                };

                this.prevState = '';
                this.gameState = 'loading';
                this.newState = null;
                
                // use this to change the gamestate. it will 
                // actually not do so, but the state will be updated on the next tick
                this.setGameState = function(newState, callback) {
                        if(newState != this.gameState && !this.newState) {
                                this.newState = { state: newState };
                                if(!_.isUndefined(callback)) {
                                        this.newState.callback = callback;
                                }
                        }
                };

                // updates the game state with data stored in this.newState
                var updateGameState = function() {
                        if(!App.Game.newState) {
                                return false;
                        }

                        App.Game.prevState = App.Game.gameState;
                        App.Game.gameState = App.Game.newState.state;

                        if(!_.isUndefined(App.Game.newState.callback)) {
                                App.Game.newState.callback();
                        }

                        App.Game.newState = null;
                        return true;
                }

                this.gameTicks = function() {
                        return (new Date()).getTime();
                };

                this.waitTimers = {};

                var loops = 0,
                    skipTicks = 1000 / 30, 
                    maxFrameskip = 10, 
                    nextGameTick = this.gameTicks(), 
                    lastGameTick;

                this.gameLoop = function() {

                        while(self.gameTicks() > nextGameTick) {
                                self.updateOps();
                                nextGameTick += skipTicks;
                                loops++;
                        }

                        if(App.Defs.Assets.Loaded.Complete) {
                                if(!loops) {
                                        self.drawOps((nextGameTick - self.gameTicks()) / skipTicks);
                                } else {
                                        self.drawOps(0);
                                }
                        }

                        // keep the loopInfo manageable 
                        _.each(self.loopInfo, function(val, key) {
                                if(self.loopInfo[key].length > 250) {
                                        self.loopInfo[key].splice(0, self.loopInfo[key].length - 250);
                                }
                        });

                        requestAnimationFrame(self.gameLoop);
                };
                
                this.loopInfo = {
                        draw: [], 
                        update: []
                };

                this.gameSpeed = 50;

                this.lastDraw = null;
                var plax = -1, plAccum = 0;
                this.drawOps = function(interpolation) {

                        var curTime = this.gameTicks(), 
                            //interpolation = (curTime - this.lastUpdate) / this.gameSpeed, 
                            moveDelta = (curTime - this.lastUpdate) / 20;

                        App.Draw.get('hud').clear();
                        App.Draw.get('entity').clear();
                        App.Draw.get('entity2').clear();

                        App.Defs.GameStates[this.gameState].tick.draw(interpolation, moveDelta);

                        App.Draw.drawTransitions(interpolation);

                        App.World.map.draw(interpolation, moveDelta);

                        if(App.Game.settings.debug.fps) {
                                App.Tools.printFPS('hud', App.Game.loopInfo);
                                App.Tools.printPlayerPos('hud', App.World.getPlayer());
                        }

                        //
                        // this should be at the end of the loop
                        //
                        var drawTime = this.gameTicks();
                        if(this.lastDraw !== null) {
                                var d = drawTime - this.lastDraw;
                                this.loopInfo.draw.push(d);
                        }

                        this.lastDraw = drawTime;
                };

                this.centerCamera = function(interpolation, moveDelta) {
                        // attempt to keep the player centered
                        var camera = App.World.map.camera, 
                            cameraCenter = camera.center(), 
                            originX = -((cameraCenter.x + camera.attrs.velocity.x * interpolation * moveDelta) - (App.Draw.width() / 2) + 260), 
                            originY = -((cameraCenter.y + camera.attrs.velocity.y * interpolation * moveDelta) - (App.Draw.height() / 2));

                        App.Draw.setOrigin(~~originX, ~~originY);
                }
                
                this.moveDelta = 1;
                this.lastUpdate = this.gameTicks();
                this.updateOps = function() {

                        var curTime = this.gameTicks(), 
                            updateDelta = (curTime - this.lastUpdate), 
                            callTime;

                        this.moveDelta = updateDelta / 20;

                        // this prevents the game from becoming janky when the UPS is slowed
                        // (which is what Chrome does if a tab is not active)
                        // I settled on 5 here because the moveDelta should be around 2.5 
                        // (20ups = 50ms per tick), 50 / 20 = 2.5 and 5 is double that
                        if(this.moveDelta > 5) {
                                this.moveDelta = 5;
                        }

                        updateGameState();

                        var player = App.World.getPlayer(0);

                        if(this.settings.video.width != window.innerWidth || 
                           this.settings.video.height != window.innerHeight) {
                                //App.Draw.setResolution();
                        }

                        App.Defs.GameStates.all.tick.update();

                        App.Defs.GameStates[this.gameState].tick.update();

                        App.Draw.runTransitions();

                        //
                        // keep this stuff at the end of the loop
                        //
                        App.Controls.keysReset();

                        curTime = this.gameTicks();
                        callTime = Math.max(0, this.gameSpeed - (curTime - this.lastUpdate));

                        if(this.lastUpdate !== null) {
                                this.loopInfo.update.push(curTime - this.lastUpdate);
                        }

                        this.lastUpdate = curTime;
                };

                this.gameplayOps = function() {
                        this.entityOps(true);
                        this.playerOps();
                };

                this.entityOps = function(excludePlayer) {
                        // run all entity timers and behaviors
                        for(var i = 0; i < App.World.map.entities.length; i++) {

                                if(excludePlayer && App.World.map.entities[i].is('IsPlayer')) {
                                        continue;
                                }

                                if(App.World.map.entities[i].removed) {
                                        continue;
                                }
                                
                                if(App.World.map.entities[i].is('IsEnemy')) {
                                        App.World.map.entities[i].c('IsEnemy').behavior();
                                }

                                if(App.World.map.entities[i].is('Projectile')) {
                                        App.World.map.entities[i].c('Projectile').behavior();
                                }

                                if(App.World.map.entities[i].is('IsCamera')) {
                                        App.World.map.entities[i].c('IsCamera').behavior();
                                }

                                if(App.World.map.entities[i].is('Particle')) {
                                        App.World.map.entities[i].c('Particle').behavior();
                                }

                                if(App.World.map.entities[i].is('Emitter')) {
                                        App.World.map.entities[i].c('Emitter').behavior();
                                }
                        }
                };

                this.defaultDir = { x: 0, y: 0 };

                this.level = 0;
                this.score = 0;

                this.best = {
                        score: -1,
                        level: 0
                };

                this.colScore = {};

                this.genMap = true;

                this.playerOps = function() {
                        var player = App.World.getPlayer(0), 
                            camera = App.World.getCamera(), 
                            diff, 
                            gridX;

                        if(player.is('Emitter')) {
                                player.c('Emitter').behavior();
                        }

                        if(player.attrs.x > 144 * 64) {
                                diff = player.attrs.x - 144 * 64;
                                player.c('Movable').setLastPos(8 * 64 + diff - 12, -1);
                                camera.c('Movable').setLastPos(8 * 64 + diff - 12 - 16, -1);
                                player.attrs.x = 8 * 64 + diff;
                                camera.attrs.x = 8 * 64 + diff - 16;

                                App.Game.setGameState('gameplay', function(){

                                        App.Game.score = 0;
                                        App.Game.level++;
                                        App.Game.defaultDir = { x: 1, y: 1 };
                                });

                                _.each(this.colScore, function(val, key){
                                        self.colScore[key] = false;
                                });
                        } else if(player.attrs.x > 128 * 64 && this.genMap) {
                                // (re)generate the map
                                self.colScore = {};
                                App.World.map.grid = App.World.map.generateBlockers(192, 9, App.Game.level + 1);
                                this.genMap = false;
                        }

                        gridX = Math.floor(player.attrs.x / 64);
                        if(!_.isUndefined(this.colScore['col_' + gridX]) && !player.c('Hurtable').isDead()) {
                                if(!this.colScore['col_' + gridX]) {
                                        this.score++;
                                        this.colScore['col_' + gridX] = true;
                                }
                        }
                };
        };
        
        root.App.Objects.Game = game;
        
})(this);
