(function(root) {

        var map = function(settings) {

                this.width = 0;
                this.height = 0;

                this.tileSize = 32;

                this.bgGrid = [];
                this.grid = [];

                this.columns = {};

                this.levelColors = {};

                // not really a quadtree
                this.quadtree = [];
                this.quadWidth = 10;

                // Dijkstra maps 
                this.dMaps = {
                        player: []
                };

                // Dijkstra map paths
                this.dPaths = {
                        player: []
                };

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
                        var grid = [], val, x = 0, y = 0, dir, lastDir = -1;
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
                                if(y > 1 && y < 7) {
                                        continue;
                                }

                                for(x = 4; x < width; x += 4) {
                                        this.columns['col_' + y] = y;
                                        grid[y][x] = 1;
                                }
                        }

                        return grid;
                };

                this.processGrid = function() {
                        // assign some base data to the grid
                        for(var y = 0; y < this.grid.length; y++) {
                                for(var x = 0; x < this.grid[y].length; x++) {
                                        if(this.grid[y][x] == 1) {
                                                this.grid[y][x] = true;
                                        } else {
                                                this.grid[y][x] = false;
                                        }
                                }
                        }
                };

                this.draw = function(interpolation, moveDelta) {
                        var x, y, i = 0, 
                            player = App.Player.playerEnt, 
                            mul = player.attrs.speed * interpolation * moveDelta;

                        for(y = 0; y < this.bgGrid.length; y++) {
                                for(x = 0; x < this.bgGrid[y].length; x++) {
                                        App.Draw.get('background').fillRect(
                                                x * this.tileSize, 
                                                y * this.tileSize + 32, 
                                                this.tileSize, 
                                                this.tileSize, 
                                                this.bgGrid[y][x]
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

                        if(App.Game.settings.debug.showQuadTree) {
                                for(i = 0; i < this.quadtree.length; i++) {

                                        App.Draw.get('entity').strokeRect(
                                                this.quadtree[i].x + 1, 
                                                this.quadtree[i].y + 1, 
                                                this.quadtree[i].w - 2, 
                                                this.quadtree[i].h - 2, 
                                                '#0F0'
                                        );

                                        App.Draw.get('entity').writeDirect(
                                                i, 
                                                App.Game.settings.debug.font, 
                                                '#0F0', 
                                                this.quadtree[i].x + 10, 
                                                this.quadtree[i].y + 30
                                        );
                                }
                        }

                        if(App.Game.settings.debug.showDMap) {

                                if(this.dPaths.player.length) {
                                        for(x = 0; x < this.dPaths.player.length; x++) {
                                                i = this.dPaths.player[x];

                                                App.Draw.get('entity').fillRect(
                                                        i.x * this.tileSize, 
                                                        i.y * this.tileSize, 
                                                        this.tileSize, 
                                                        this.tileSize, 
                                                        '#F00'
                                                );
                                        }
                                }

                                for(y = 0; y < this.dMaps.player.length; y++) {
                                        for(x = 0; x < this.dMaps.player[y].length; x++) {

                                                App.Draw.get('entity').strokeRect(
                                                        x * this.tileSize + 1, 
                                                        y * this.tileSize + 1, 
                                                        this.tileSize - 2, 
                                                        this.tileSize - 2, 
                                                        '#00F'
                                                );

                                                App.Draw.get('entity').writeDirect(
                                                        this.dMaps.player[y][x], 
                                                        App.Game.settings.debug.font, 
                                                        '#00F', 
                                                        x * this.tileSize + 10, 
                                                        y * this.tileSize + 30
                                                );
                                        }
                                }
                        }
                };

                this.pool = {
                        projectile: []
                };

                this.spawn = function(name, x, y) {

                        var props = App.Definitions.get('Entity', name), 
                            entity;

                        props.x    = x;
                        props.y    = y;
                        props.type = name;
                        props.id   = this.entities.length;

                        entity = new App.Objects.Entity(props);

                        // figure out which quad this goes into
                        for(var i = 0; i < this.quadtree.length; i++) {
                                if(App.Tools.boxesIntersect(
                                        props.x, 
                                        props.y, 
                                        props.width, 
                                        props.height, 
                                        this.quadtree[i].x, 
                                        this.quadtree[i].y, 
                                        this.quadtree[i].w, 
                                        this.quadtree[i].h
                                )) {
                                        if(entity.is('Collidable')) {
                                                entity.c('Collidable').quadIds.push(i);
                                                this.quadtree[i].addChild(props.id - 1);
                                        }
                                }
                        }

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

                        for(i = 0; i < this.quadtree.length; i++) {
                                delete this.quadtree[i];
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

                        self.quadWidth = 6;

                        // set up the "quadtree"
                        // this is based on the map's dimensions in pixels, not tiles
                        var mapWidth = settings.width * self.tileSize, 
                            mapHeight = settings.height * self.tileSize, 
                            branchWidth  = Math.ceil(mapWidth / self.quadWidth), 
                            quadHeight = Math.ceil(mapHeight / branchWidth), 
                            branchHeight = Math.ceil(mapHeight / quadHeight);
                        
                        for(var y = 0; y < quadHeight; y++) {
                                for(var x = 0; x < self.quadWidth; x++) {
                                        self.quadtree.push(
                                                new App.Objects.QuadTree(
                                                        x * branchWidth, 
                                                        y * branchHeight, 
                                                        branchWidth, 
                                                        branchHeight 
                                                )
                                        );
                                }
                        }

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

                        // allocate the projectile pool
                        var pId;
                        for(var i = 0; i < 50; i++) {
                                pId = self.spawn('bullet', 0, 0);
                                self.entities[pId].removed = true;
                                self.pool.projectile.push(pId);
                        }

                        //self.generateDMap('player', [ { x: 2, y: 2 } ]);

                })(settings, this);
        };

        root.App.Objects.Map = map;

        var quadTree = function(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.w = width;
                this.h = height;
                this.children = {};

                this.addChild = function(childId) {
                        this.children[childId] = childId;
                };

                this.removeChild = function(childId) {
                        if(!_.isUndefined(this.children[childId])) {
                                delete this.children[childId];
                                return true;
                        }
                        return false;
                };

                this.clear = function() {
                        delete this.children;
                        this.children = {};
                };
        };

        root.App.Objects.QuadTree = quadTree;

})(this);
