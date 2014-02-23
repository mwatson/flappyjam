(function(root) {

        var map = function(settings) {

                this.width = 0;
                this.height = 0;

                this.tileSize = 32;

                this.bgGrid = [];
                this.grid = [];

                this.columns = {};
                this.numCols = 0;

                this.levelColors = {};

                this.levelColorFadeTo = {};

                this.entityMap = {};

                this.bounds = {};

                this.entities = [];

                this.playerSpawn = { x: 0, y: 0 };

                this.camera = null;

                this.createBackgroundGrid = function(width, height) {
                        this.bgGrid = [];
                        for(var y = 0; y < height; y++) {
                                this.bgGrid.push([]);
                                for(var x = 0; x < width; x++) {
                                        this.bgGrid[this.bgGrid.length - 1].push(true);
                                }
                        }
                };

                //cache grid for speedier drawing (?)
                this.cacheGrid = function(width, height) {
                        //var c = document.createElement('canvas');
                };

                this.generateBlockers = function(width, height, level) {
                        // generate an empty map grid
                        var grid = [], val, x = 0, y = 0;
                        for(y = 0; y < height; y++) {
                                grid.push([]);
                                for(x = 0; x < width; x++) {
                                        grid[y].push(0);
                                }
                        }

                        // some post-processing (fill in two two surrounding rows)
                        for(y = 0; y < height; y++) {
                                for(x = 0; x < width; x++) {
                                        if(y < 1 || x < 1) {
                                                grid[y][x] = 1;
                                        }

                                        if(y > height - 2 || x > width - 2) {
                                                grid[y][x] = 1;
                                        }
                                }
                        }

                        if(_.isUndefined(App.Defs.Levels[level])) {
                                level = level % App.Defs.Levels.length;
                        }

                        // build level columns
                        this.columns = App.Defs.Levels[level].build(width, height);
                        grid = this.processColumns(
                                grid, 
                                App.Defs.Levels[level].params.gap, 
                                App.Defs.Levels[level].params.heightDiff, 
                                App.Defs.Levels[level].params.heightMax
                        );

                        this.levelColorsFadeTo = App.Defs.Levels[level].params.colors;

                        return grid;
                };

                this.processColumns = function(grid, gapSize, heightDiff, heightMax) {
                        // process columns
                        var c, st = 2, lst = 0;
                        _.each(this.columns, function(val, key){

                                App.Game.colScore[key] = false;

                                st = App.Tools.rand(1, heightMax);
                                while(Math.abs(st - lst) > heightDiff) {
                                        if(st > lst) { 
                                                st--;
                                        } else {
                                                st++;
                                        }
                                }

                                grid[st][val] = 1;
                                c = st - 1;
                                while(c > 0) {
                                        grid[c][val] = 1;
                                        c--;
                                }

                                grid[st + 3][val] = 1;
                                c = st + 4;
                                while(c < 9) {
                                        grid[c][val] = 1;
                                        c++;
                                }
                                lst = st;
                        });

                        this.numCols = _.keys(this.columns).length;

                        return grid;
                };

                this.draw = function(interpolation, moveDelta) {
                        var x, y, j = 0, i = 0, col, 
                            player = App.Player.playerEnt, 
                            mul = player.attrs.speed * interpolation * moveDelta, 
                            colors = [ 'main', 'shadow', 'bgColor', 'bgGrid' ], 
                            rgb = [ 'r', 'g', 'b' ];

                        for(j = 0; j < colors.length; j++) {
                                if(this.levelColorsFadeTo[colors[j]] != this.levelColors[colors[j]]) {
                                        for(i = 0; i < rgb.length; i++) {
                                                if(this.levelColorsFadeTo[colors[j]][rgb[i]] > this.levelColors[colors[j]][rgb[i]]) {
                                                        this.levelColors[colors[j]][rgb[i]]++;
                                                } else if(this.levelColorsFadeTo[colors[j]][rgb[i]] < this.levelColors[colors[j]][rgb[i]]) {
                                                        this.levelColors[colors[j]][rgb[i]]--;
                                                }
                                        }
                                }
                        }

                        for(y = 0; y < this.bgGrid.length; y++) {
                                for(x = 0; x < this.bgGrid[y].length; x++) {
                                        App.Draw.get('background').strokeFillRect(
                                                x * this.tileSize + 24, 
                                                y * this.tileSize + 20, 
                                                this.tileSize * 2, 
                                                this.tileSize * 2, 
                                                App.Tools.rgbObjToColor(this.levelColors.bgColor), 
                                                App.Tools.rgbObjToColor(this.levelColors.bgGrid), 
                                                2
                                        );
                                }
                        }

                        for(i = 0; i < this.entities.length; i++) {
                                if(this.entities[i].removed) {
                                        continue;
                                }
                                if(!this.entities[i].is('IsPlayer') && this.entities[i].is('Renderable')) {
                                        this.entities[i].c('Renderable').draw(interpolation, null, moveDelta);
                                }
                        }

                        // hopefully the player is always renderable
                        this.entities[0].c('Renderable').draw(interpolation, null, moveDelta);

                        for(y = 0; y < this.grid.length; y++) {
                                for(x = 0; x < this.grid[y].length; x++) {
                                        if(this.grid[y][x]) {
                                                App.Draw.get('entity2').fillRect(
                                                        x * this.tileSize - 2,
                                                        y * this.tileSize + 2,
                                                        this.tileSize, 
                                                        this.tileSize, 
                                                        App.Tools.rgbObjToColor(this.levelColors.shadow)
                                                );

                                                App.Draw.get('entity').fillRect(
                                                        x * this.tileSize,
                                                        y * this.tileSize,
                                                        this.tileSize, 
                                                        this.tileSize, 
                                                        App.Tools.rgbObjToColor(this.levelColors.main)
                                                );
                                        }
                                }
                        }
                };

                this.pool = {
                        projectile: [], 
                        particle: []
                };

                this.spawn = function(name, x, y) {

                        var props = App.Definitions.get('Entity', name), 
                            entity;

                        props.x    = x;
                        props.y    = y;
                        props.type = name;
                        props.id   = this.entities.length;

                        entity = new App.Objects.Entity(props);

                        this.entities.push(entity);

                        return props.id;
                };

                this.fromPool = function(poolName, x, y) {
                        var pId;
                        for(var i = 0; i < this.pool[poolName].length; i++) {
                                pId = this.pool[poolName].shift();
                                this.pool[poolName].push(pId);
                                if(App.World.map.entities[pId].removed) {
                                        break;
                                }
                                pId = false;
                        }

                        if(pId === false) {
                                // spawn a new thing?!
                                //pId = self.spawn('bullet', 0, 0);
                                //self.entities[pId].removed = true;
                                //self.pool.projectile.push(pId);
                        }

                        App.World.map.entities[pId].attrs.x = x;
                        App.World.map.entities[pId].attrs.y = y;
                        App.World.map.entities[pId].removed = false;

                        return pId;
                };

                this.removeEntities = function() {
                        for(i = 0; i < this.entities.length; i++) {
                                this.entities[i].shutdown();
                                delete this.entities[i];
                        }
                        delete this.entities;

                        this.entities = [];
                };

                this.destroy = function() {
                        var i = 0;
                        
                        for(i = 0; i < this.entities.length; i++) {
                                //this.entities[i].shutdown();
                                delete this.entities[i];
                        }
                };

                this.init = (function(settings, self) {
                        self.tileSize = settings.tileSize;
                        self.bounds = settings.bounds;
                        self.playerSpawn = settings.playerStart;

                        if(_.isUndefined(self.bounds.top)) {
                                self.bounds.top = 0;
                        }
                        if(_.isUndefined(self.bounds.left)) {
                                self.bounds.left = 0;
                        }
                        if(_.isUndefined(self.bounds.bottom)) {
                                self.bounds.bottom = settings.height * self.tileSize;
                        }
                        if(_.isUndefined(self.bounds.right)) {
                                self.bounds.right = settings.width * self.tileSize;
                        }

                        // set the origin min/maxes
                        App.Draw.bounds.x.max = 0;
                        App.Draw.bounds.x.min = -(settings.width * self.tileSize - App.Draw.width());
                        App.Draw.bounds.y.max = 0;
                        App.Draw.bounds.y.min = -(settings.height * self.tileSize - App.Draw.height());

                        var width  = settings.width, 
                            height = settings.height;

                        if(App.Draw.get('background').parallax.x < 1) {
                                width += width * App.Draw.get('background').parallax.x;
                        }

                        if(App.Draw.get('background').parallax.y < 1) {
                                height += height * App.Draw.get('background').parallax.y;
                        }

                        self.createBackgroundGrid(width, height);

                        // generate the map
                        if(!settings.blockers.length) {
                                self.grid = self.generateBlockers(
                                        settings.width, 
                                        settings.height, 
                                        0
                                );
                        } else {
                                self.grid = settings.blockers;
                        }

                        self.levelColors = App.Defs.Levels[0].params.colors;

                        // spawn the player
                        var playerId = self.spawn(
                                'player', 
                                self.playerSpawn.x + Math.floor(App.Defaults.Entity.player.width / 4), 
                                self.playerSpawn.y + Math.floor(App.Defaults.Entity.player.height / 4)
                        );
                        App.Player.playerEnt = self.entities[playerId];

                        // spawn the camera
                        var cameraId = self.spawn(
                                'camera',
                                App.Player.playerEnt.attrs.x,
                                App.Player.playerEnt.attrs.y
                        );
                        self.camera = self.entities[cameraId];

                        // spawn everything else
                        //self.spawnEnemies();

                        if(!_.isUndefined(settings.loaded)) {
                                settings.loaded();
                        }

                        self.width  = settings.width;
                        self.height = settings.height;

                        // allocate the particle pool
                        var pId;
                        for(var i = 0; i < 50; i++) {
                                pId = self.spawn('particle', 0, 0);
                                self.entities[pId].removed = true;
                                self.pool.particle.push(pId);
                        }

                })(settings, this);
        };

        root.App.Objects.Map = map;

})(this);
