(function(root) {

        var entity = function(settings) {

                this.attrs = {
                        x: 0, 
                        y: 0, 
                        width: 0, 
                        height: 0, 
                        speed: 0, 

                        velocity: {
                                x: 0, 
                                y: 0
                        }, 
                        dir: {
                                x: 0, 
                                y: 0
                        }
                };

                this.state = 'idle';
                this.prevState = 'idle';

                this.removed = false;

                this.center = function() {
                        return {
                                x: this.attrs.x + this.attrs.width / 2, 
                                y: this.attrs.y + this.attrs.height / 2
                        };
                };

                var components = {};

                this.c = function(component) {
                        if(!_.isUndefined(components[component])) {
                                return components[component];
                        }
                        return false;
                };

                this.is = function(component) {
                        if(!_.isUndefined(components[component])) {
                                return true;
                        }
                        return false;
                };

                this.addComponent = function(componentType, settings) {
                        if(_.isUndefined(App.Objects.Components[componentType])) {
                                return false;
                        }

                        if(!_.isUndefined(components[componentType])) {
                                this.removeComponent(componentType);
                        }
                        
                        components[componentType] = new App.Objects.Components[componentType](this, settings);
                };

                this.removeComponent = function(componentType) {
                        if(!_.isUndefined(components[componentType])) {
                                delete components[componentType];
                        }
                };

                this.setPosition = function(x, y) {
                        this.attrs.x = x;
                        this.attrs.y = y;
                };

                this.changeState = function(newState, callback) {
                        if(this.state == newState) {
                                return false;
                        }

                        this.prevState = this.state;
                        this.state = newState;
                        if(callback) {
                                callback();
                        }

                        return true;
                };

                // flag for removal
                this.removeEntity = function(callback) {
                        this.removed = true;
                        if(_.isFunction(callback)) {
                                callback();
                        }
                };

                this.init = (function(settings, self){

                        self.attrs.width = settings.width;
                        self.attrs.height = settings.height;
                        self.attrs.x = settings.x;
                        self.attrs.y = settings.y;
                        self.attrs.speed = settings.speed;

                        _.each(settings.components, function(cdata, cname){
                                self.addComponent(cname, cdata);
                        });

                })(settings, this);
        };

        root.App.Objects.Entity = entity;

        root.App.Objects.Components = {};

        var renderable = function(entity, settings) {

                this.attrs = {
                        color: settings.color,
                        sprites: _.isUndefined(settings.sprites) ? false : App.Defs.Sprites[settings.sprites], 
                        shadow: _.isUndefined(settings.shadow) ? false : settings.shadow
                };

                var en = entity, 
                    // store the state for sprites
                    curState = '', 
                    prevState = '', 
                    curFrame = 0, 
                    frameCtr = 0;

                this.draw = function(interpolation, canvasId, moveDelta) {

                        if(!moveDelta) {
                                moveDelta = 1;
                        }

                        if(!canvasId) {
                                canvasId = 'entity';
                        }

                        var lastPos = en.c('Movable').getLastPos(), 
                            xDir = en.attrs.x - lastPos.x, 
                            xPos = en.attrs.x + en.attrs.velocity.x * interpolation * moveDelta, 
                            yPos = en.attrs.y + en.attrs.velocity.y * interpolation * moveDelta, 
                            diff = App.Game.gameTicks() - App.Game.lastUpdate;

                        if(this.attrs.sprites) {

                                // figure out the frame based on the state
                                curState = 'idle';
                                if(en.state == 'walk') {

                                        if(en.attrs.dir.x == 1) {
                                                curState = 'walkRight';
                                        } else if(en.attrs.dir.x == -1) {
                                                curState = 'walkLeft';
                                        }

                                        if(_.isUndefined(this.attrs.sprites[curState])) {
                                                curState = 'walk';
                                        }
                                } else if(en.state == 'dead') {
                                        curState = 'dead';
                                }

                                if(_.isUndefined(this.attrs.sprites[curState])) {
                                        curState = 'idle';
                                }

                                if(curState != prevState) {
                                        // reset frame counter
                                        curFrame = 0;
                                        frameCtr = 0;
                                        prevState = curState;
                                }

                                frameCtr += diff;
                                if(frameCtr > this.attrs.sprites[curState][curFrame].duration) {
                                        curFrame++;
                                        frameCtr = 0;
                                }

                                if(_.isUndefined(this.attrs.sprites[curState][curFrame])) {
                                        curFrame = 0;
                                }

                                App.Draw.get(canvasId).drawImg(
                                        this.attrs.sprites[curState][curFrame].frame, 
                                        xPos, 
                                        yPos
                                );

                        } else {

                                App.Draw.get(canvasId).fillRect(
                                        xPos, 
                                        yPos, 
                                        en.attrs.width, 
                                        en.attrs.height, 
                                        this.attrs.color
                                );
                        }

                        if(!_.isUndefined(settings.draw)) {
                                settings.draw(xPos, yPos);
                        }
                };
        };

        root.App.Objects.Components.Renderable = renderable;

        var movable = function(entity, settings) {

                var en = entity, 
                    attrs = {
                        acceleration: (_.isUndefined(settings.acceleration) ? 1 : settings.acceleration), 
                        lastPos: { x: 0, y: 0 }
                    };

                this.getLastPos = function() {
                        return attrs.lastPos;
                };

                this.setLastPos = function(x, y) {
                        if(x >= 0) {
                                attrs.lastPos.x = x;
                        }
                        if(y >= 0) {
                                attrs.lastPos.y = y;
                        }
                };

                this.move = function(xDir, yDir) {

                        var xStep = en.attrs.x, 
                            yStep = en.attrs.y, 
                            newPos, 
                            speed = en.attrs.speed;

                        // set the directions on the entity
                        en.attrs.dir.x = xDir;
                        en.attrs.dir.y = yDir;

                        en.attrs.velocity.x += ((xDir * en.attrs.speed) - en.attrs.velocity.x) * attrs.acceleration;
                        en.attrs.velocity.y += ((yDir * en.attrs.speed) - en.attrs.velocity.y) * attrs.acceleration;

                        xStep += ~~((en.attrs.velocity.x * App.Game.moveDelta));
                        yStep += ~~((en.attrs.velocity.y * App.Game.moveDelta));

                        if(en.is('Collidable')) {
                                newPos = en.c('Collidable').checkMapCollision(xStep, yStep);
                        } else {
                                newPos = { x: xStep, y: yStep };
                        }

                        attrs.lastPos.x = en.attrs.x;
                        attrs.lastPos.y = en.attrs.y;

                        en.setPosition(newPos.x, newPos.y);

                        if(en.is('Hurtable') && en.c('Hurtable').isDead()) {
                                // don't change state if the entity is dead
                        } else if(xDir !== 0) {
                                en.changeState('walk');
                        } else {
                                en.changeState('idle');
                        }

                        return newPos;
                };
        };

        root.App.Objects.Components.Movable = movable;

        // collides with the map and other entities
        var collidable = function(entity, settings) {

                var en = entity;

                this.quadIds = [];

                // default bounding box
                this.bBox = {
                        x: function(axis) {
                                return en.attrs.x;
                        }, 
                        xStep: function(axis, position) {
                                return position;
                        }, 
                        y: function(axis) {
                                return en.attrs.y;
                        },
                        yStep: function(axis, position) {
                                return position;
                        },
                        w: function(axis) {
                                return en.attrs.width;
                        }, 
                        h: function(axis) {
                                return en.attrs.height;
                        }
                };

                if(!_.isUndefined(settings.method)) {
                        if(settings.method == 'cross') {
                                this.bBox = {
                                        x: function(axis) {
                                                return en.attrs.x + settings.setup[axis].x;
                                        }, 
                                        xStep: function(axis, position) {
                                                return position + settings.setup[axis].x;
                                        }, 
                                        y: function(axis) {
                                                return en.attrs.y + settings.setup[axis].y;
                                        },
                                        yStep: function(axis, position) {
                                                return position + settings.setup[axis].y;
                                        }, 
                                        w: function(axis) {
                                                return settings.setup[axis].width;
                                        }, 
                                        h: function(axis) {
                                                return settings.setup[axis].height;
                                        }
                                };
                        }
                }

                this.checkMapCollision = function(xStep, yStep) {

                        var xMin = 0, 
                            yMin = 0, 
                            lastPos = en.c('Movable').getLastPos(), 
                            xDir = xStep - lastPos.x, 
                            yDir = yStep - lastPos.y, 
                            xCols = [], 
                            yRows = [], 
                            collisions = [];

                        // minimum for the x-axis
                        if(xDir > 0) {
                                xMin = xStep + this.bBox.w('x');
                        } else if(xDir < 0) {
                                xMin = xStep;
                        }

                        if(xDir != 0) {
                                s1 = Math.floor(this.bBox.y('x') / App.World.map.tileSize);
                                s2 = Math.floor((this.bBox.y('x') + this.bBox.h('x')) / App.World.map.tileSize);
                                for(i = s1; i <= s2; i++) {
                                        yRows.push(i);
                                }

                                for(i = 0; i < yRows.length; i++) {
                                        s1 = Math.floor(xMin / App.World.map.tileSize);
                                        if(_.isUndefined(App.World.map.grid[yRows[i]])) {
                                        } else if(!!App.World.map.grid[yRows[i]][s1] !== false) {
                                                if(xDir > 0) {
                                                        xStep = s1 * App.World.map.tileSize - this.bBox.w('x') - 1;
                                                } else if(xDir < 0) {
                                                        xStep = s1 * App.World.map.tileSize + App.World.map.tileSize;
                                                }
                                                en.attrs.velocity.x = 0;
                                                collisions.push({ type: 'map', x: s1, y: yRows[i] });
                                        }
                                }
                        }

                        // min for the y-axis
                        if(yDir > 0) {
                                yMin = yStep + this.bBox.h('y');
                        } else if(yDir < 0) {
                                yMin = yStep;
                        }

                        if(yDir != 0) {
                                s1 = Math.floor(this.bBox.xStep('y', xStep) / App.World.map.tileSize);
                                s2 = Math.floor((this.bBox.xStep('y', xStep) + this.bBox.w('y')) / App.World.map.tileSize);
                                for(i = s1; i <= s2; i++) {
                                        xCols.push(i);
                                }

                                for(i = 0; i < xCols.length; i++) {
                                        s1 = Math.floor(yMin / App.World.map.tileSize);
                                        if(_.isUndefined(App.World.map.grid[s1])) {
                                        } else if(!!App.World.map.grid[s1][xCols[i]] !== false) {
                                                if(yDir > 0) {
                                                        yStep = s1 * App.World.map.tileSize - this.bBox.h('y') - 1;
                                                } else if(yDir < 0) {
                                                        yStep = s1 * App.World.map.tileSize + App.World.map.tileSize;
                                                }
                                                en.attrs.velocity.y = 0;
                                                collisions.push({ type: 'map', x: xCols[i], y: s1 });
                                        }
                                }
                        }

                        return { collisions: collisions, x: xStep, y: yStep };
                }
        };

        root.App.Objects.Components.Collidable = collidable;

        var isPlayer = function(entity, settings) {
        };

        root.App.Objects.Components.IsPlayer = isPlayer;

        var hurtable = function(entity, settings) {

                this.en = entity;

                this.health = settings.health;
                this.onDeath = function() { };
                this.died = false;

                if(!_.isUndefined(settings.onDeath)) {
                        this.onDeath = settings.onDeath;
                }

                this.takeDamage = function(amount) {
                        this.health -= amount;

                        if(this.isDead() && !this.died) {
                                this.onDeath();
                                this.died = true;
                        }
                };

                this.isDead = function() {
                        this.en.changeState('dead');
                        return this.health <= 0 ? true : false;
                };
        };

        root.App.Objects.Components.Hurtable = hurtable;


        var projectile = function(entity, settings) {

                this.en = entity;

                this.init = function(x, y, parent){

                        // convert game area position to map position
                        // (offset by -32 because of the cursor/crosshair)
                        x -= App.Draw.canvas.entity.origin.x - 32;
                        y -= App.Draw.canvas.entity.origin.y - 32;

                        var projX = Math.abs(this.en.attrs.x - x), 
                            projY = Math.abs(this.en.attrs.y - y);
                            
                        if(projX > projY) {
                                projY = projY / projX;
                                projX = 1;
                        } else {
                                projX = projX / projY;
                                projY = 1;
                        }
                        
                        if(this.en.attrs.x > x) {
                                projX *= -1;
                        }
                        
                        if(this.en.attrs.y > y) {
                                projY *= -1;
                        }

                        this.en.attrs.dir.x = projX;
                        this.en.attrs.dir.y = projY;
                };

                // default projectile behavior is to just move in one direction forever
                this.behavior = function() {
                        var newPos;
                        if(!this.en.is('Movable')) {
                                return;
                        }
                        
                        newPos = this.en.c('Movable').move(this.en.attrs.dir.x, this.en.attrs.dir.y);

                        if(!this.en.is('Collidable')) {
                                return;
                        }

                        if(newPos.collisions.length) {
                                this.en.removeEntity();
                        }
                };

                if(settings.behavior) {
                        this.behavior = settings.behavior;
                }
        };

        root.App.Objects.Components.Projectile = projectile;

        var hasProjectile = function(entity, settings) {

                var en = entity, 
                    rate = settings.rate, 
                    rateTimer = 0;

                this.fire = function(x, y) { // x and y are the point the projectile should be aimed towards

                        if(!this.timer()) {
                                return;
                        }

                        var pId = App.World.map.fromPool(
                                'projectile', 
                                en.attrs.x + settings.origin.x, 
                                en.attrs.y + settings.origin.y
                        );

                        App.World.map.entities[pId].c('Projectile').init(x, y, en);

                        return;
                };

                this.timer = function() {
                        rateTimer -= App.Game.gameTicks() - App.Game.lastUpdate;
                        if(rateTimer <= 0) {
                                rateTimer = rate;
                                return true;
                        }
                        return false;
                };
        };

        root.App.Objects.Components.HasProjectile = hasProjectile;

        var isEnemy = function(entity, settings) {

                this.en = entity;

                this.behavior = function() {
                        return 1;
                };

                if(settings.behavior) {
                        this.behavior = settings.behavior;
                }
        };

        root.App.Objects.Components.IsEnemy = isEnemy;

        var isCamera = function(entity, settings) {

                this.en = entity;

                this.behavior = function() {
                        return 1;
                };

                if(settings.behavior) {
                        this.behavior = settings.behavior;
                }
        };

        root.App.Objects.Components.IsCamera = isCamera;

        var particle = function(entity, settings) {

                this.en = entity;

                var startState, endState, ttl, ctr, curCol;

                // init should be called for anything spawned via a pool
                this.init = function(settings) {
                        startState = settings.startState;
                        endState = settings.endState;
                        ttl = settings.ttl;
                        ctr = 0;

                        this.en.attrs.width = startState.width;
                        this.en.attrs.height = startState.height;
                        this.en.attrs.speed = startState.speed;
                        this.en.c('Renderable').attrs.color = 
                                'rgba(' + startState.color.r + ',' + 
                                          startState.color.g + ',' + 
                                          startState.color.b + ',1.0)';

                        curCol = _.clone(startState.color);
                };

                this.behavior = function() {

                        var diff = App.Game.gameTicks() - App.Game.lastUpdate, 
                            dpct, 
                            tdiff, 
                            colStr, 
                            self = this;

                        ctr += diff;

                        if(ctr >= ttl) {
                                this.en.removeEntity();
                                return;
                        }

                        dpct = diff / ttl;
                        _.each(startState, function(val, key){
                                switch(key) {
                                        case 'width':
                                        case 'height':
                                        case 'speed':
                                                tdiff = (startState[key] - endState[key]) * dpct;
                                                self.en.attrs[key] -= tdiff;
                                                if(key == 'width') {
                                                        self.en.attrs.x -= (tdiff / 2);
                                                } else if(key == 'height') {
                                                        self.en.attrs.y -= (tdiff / 2);
                                                }
                                                break;

                                        case 'color':
                                                colStr = [];
                                                _.each(startState.color, function(colVal, colName){
                                                        tdiff = (startState.color[colName] - endState.color[colName]) * dpct;
                                                        curCol[colName] -= tdiff;
                                                        colStr.push(Math.floor(curCol[colName]));
                                                });
                                                self.en.c('Renderable').attrs.color = 'rgba(' + colStr.join() + ',1.0)';
                                                //console.log(curCol);
                                                break;
                                }
                        });

                        this.en.c('Movable').move(
                                this.en.attrs.dir.x,
                                this.en.attrs.dir.y
                        );
                };
        };

        root.App.Objects.Components.Particle = particle;

        var emitter = function(entity, settings) {

                this.en = entity;
                var particles = settings.particles, 
                    ctr = [], 
                    enabled = true;

                for(var i = 0; i < particles.length; i++) {
                        ctr.push(0);
                }

                this.behavior = function() {

                        var pId, diff;

                        if(!enabled) {
                                return;
                        }

                        diff = (App.Game.gameTicks() - App.Game.lastUpdate);

                        for(var i = 0; i < particles.length; i++) {
                                ctr[i] += diff;
                                if(ctr[i] >= particles[i].rate) {
                                        pId = App.World.map.fromPool(
                                                'particle', 
                                                this.en.attrs.x + particles[i].spawnOffset.x, 
                                                this.en.attrs.y + particles[i].spawnOffset.y
                                        );
                                        App.World.map.entities[pId].c('Particle').init(particles[i]);
                                        App.World.map.entities[pId].attrs.velocity.x = this.en.attrs.velocity.x;
                                        App.World.map.entities[pId].attrs.velocity.y = this.en.attrs.velocity.y;
                                        App.World.map.entities[pId].attrs.dir.x = particles[i].dir.x;
                                        App.World.map.entities[pId].attrs.dir.y = particles[i].dir.y;
                                        ctr[i] = 0;
                                }
                        }
                };

                this.enable = function() {
                        enabled = true;
                };

                this.disable = function() {
                        enabled = false;
                };
        };

        root.App.Objects.Components.Emitter = emitter;

})(this);
