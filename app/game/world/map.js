(function(root) {

        var map = function(settings) {

                this.width = 0;
                this.height = 0;

                this.tileSize = 32;

                this.bgGrid = [];
                this.grid = [];

                this.columns = {};

                this.levelColors = {};

                this.entityMap = {};

                this.bounds = {};

                this.entities = [];

                this.playerSpawn = { x: 0, y: 0 };

                this.camera = null;

                this.createBackgroundGrid = function(width, height, rows) {
                        var rowMap = {}, 
                            tileColor, 
                            fgTileColor, 
                            bgTileColor, 
                            gridMap;

                        for(var i = 0; i < rows.length; i++) {
                                rowMap['r_' + rows[i].depth] = rows[i];
                        }
                        fgTileColor = rowMap.r_0.fgColor;
                        bgTileColor = rowMap.r_0.bgColor;

                        this.bgGrid = [];
                        for(var y = 0; y < height; y++) {
                                if(!_.isUndefined(rowMap['r_' + y])) {
                                        fgTileColor = rowMap['r_' + y].fgColor;
                                        bgTileColor = rowMap['r_' + y].bgColor;
                                }

                                this.bgGrid.push([]);
                                for(var x = 0; x < width; x++) {
                                        tileColor = fgTileColor;
                                        if(!(x % 2) && (y % 2)) {
                                                tileColor = bgTileColor;
                                        } else if((x % 2) && !(y % 2)) {
                                                tileColor = bgTileColor;
                                        }

                                        this.bgGrid[this.bgGrid.length - 1].push(tileColor);
                                }
                        }
                };

                //cache grid for speedier drawing (?)
                this.cacheGrid = function(width, height) {
                        //var c = document.createElement('canvas');
                };

                this.generateBlockers = function(width, height, mapSize) {
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

                        // add in columns (evenly spaced)
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += 6) {
                                        this.columns['col_' + x] = x;
                                        App.Game.colScore['col_' + x] = false;
                                }
                        }

                        var c, st = 2, lst = 0;
                        _.each(this.columns, function(val, key){

                                st = App.Tools.rand(1, 4);
                                while(Math.abs(st - lst) > 2) {
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

                        return grid;
                };

                this.processGrid = function() {
                        // assign some base data to the grid
                        for(var y = 0; y < this.grid.length; y++) {
                                for(var x = 0; x < this.grid[y].length; x++) {
                                        if(this.grid[y][x] == 1) {
                                                //this.grid[y][x] = true;
                                        } else {
                                                //this.grid[y][x] = false;
                                        }
                                }
                        }
                };

                this.draw = function(interpolation, moveDelta) {
                        var x, y, i = 0, col, 
                            player = App.Player.playerEnt, 
                            mul = player.attrs.speed * interpolation * moveDelta;

                        for(y = 0; y < this.bgGrid.length; y++) {
                                for(x = 0; x < this.bgGrid[y].length; x++) {
                                        App.Draw.get('background').strokeFillRect(
                                                x * this.tileSize + 24, 
                                                y * this.tileSize + 20, 
                                                this.tileSize * 2, 
                                                this.tileSize * 2, 
                                                settings.rows[0].fgColor, 
                                                settings.rows[0].bgColor, 
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
                                                        this.levelColors.shadow
                                                );

                                                App.Draw.get('entity').fillRect(
                                                        x * this.tileSize,
                                                        y * this.tileSize,
                                                        this.tileSize, 
                                                        this.tileSize, 
                                                        this.levelColors.main
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
                        self.levelColors = settings.colors;

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

                        self.createBackgroundGrid(width, height, settings.rows);

                        // generate the map
                        if(!settings.blockers.length) {
                                self.grid = self.generateBlockers(
                                        settings.width, 
                                        settings.height, 
                                        settings.mapSize
                                );
                        } else {
                                self.grid = settings.blockers;
                        }
                        self.processGrid();

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
