(function(root) {

        var controls = function() {
                
                this.buttonStates = {
                        INACTIVE: -1, 
                        DOWN: 0,
                        UP: 1
                };
                
                this.keys = {
                        ESC: 27, 
                        W: 87,
                        A: 65, 
                        S: 83, 
                        D: 68, 
                        M: 77, 
                        P: 80, 
                        ARROW_UP: 38, 
                        ARROW_RIGHT: 39, 
                        ARROW_DOWN: 40, 
                        ARROW_LEFT: 37, 
                        SPACE: 32, 
                        ENTER: 13, 
                        TILDE: 192
                };

                this.mouse = {
                        BUTTON_LEFT: 1, 
                        BUTTON_MIDDLE: 2, 
                        BUTTON_RIGHT: 3
                };

                this.cursorState = { x: 0, y: 0 };
                
                this.keyState = {};

                this.mouseState = {};

                var keyCheck = function(key, state) {
                        var k = App.Controls.keys[key];
                        if(App.Controls.keyState[k] == state) {
                                return true;
                        }
                        return false;
                }, 
                setKeyDown = function(index) {
                        App.Controls.keyState[index] = App.Controls.buttonStates.DOWN;
                }, 
                setKeyUp = function(index)             {
                        App.Controls.keyState[index] = App.Controls.buttonStates.UP;
                }, 
                setKeyInactive = function(index)             {
                        App.Controls.keyState[index] = App.Controls.buttonStates.UP;
                }, 

                mouseCheck = function(button, state) {
                        var m = App.Controls.mouse[button];
                        if(App.Controls.mouseState[m] == state) {
                                return true;
                        }
                        return false;
                }, 
                setMouseDown = function(button) {
                        App.Controls.mouseState[button] = App.Controls.buttonStates.DOWN;
                }, 
                setMouseUp = function(button) {
                        App.Controls.mouseState[button] = App.Controls.buttonStates.UP;
                }, 
                setMouseInactive = function(button) {
                        App.Controls.mouseState[button] = App.Controls.buttonStates.UP;
                }, 
                setMouseCursor = function(x, y) {
                        var canvasOffset = App.Draw.getCanvasOffset('entity'), 
                            xVal, yVal;

                        if(x < canvasOffset.x - 64) {
                                xVal = -64;
                        } else if(x > canvasOffset.x + canvasOffset.width) {
                                xVal = canvasOffset.width;
                        } else {
                                xVal = x - canvasOffset.x;
                        }

                        if(y < canvasOffset.y - 64) {
                                yVal = -64;
                        } else if(y > canvasOffset.y + canvasOffset.height) {
                                yVal = canvasOffset.height;
                        } else {
                                yVal = y - canvasOffset.y;
                        }

                        App.Controls.cursorState.x = xVal;
                        App.Controls.cursorState.y = yVal;
                };

                // use these functions to check for key presses (you don't need to use .check())
                this.keyPress = function(key) {
                        return keyCheck(key, this.buttonStates.UP);
                };

                this.keyDown = function(key) {
                        return keyCheck(key, this.buttonStates.DOWN);
                };

                this.keyUp = function(key) {
                        return keyCheck(key, this.buttonStates.INACTIVE);
                };


                this.key = function(index) {
                        return this.keyState[index];
                };

                this.mouseClick = function(button) {
                        return mouseCheck(button, this.buttonStates.UP);
                };

                this.mouseDown = function(button) {
                        return mouseCheck(button, this.buttonStates.DOWN);
                };

                this.mouseUp = function(button) {
                        return mouseCheck(button, this.buttonStates.INACTIVE);
                };

                this.mouseCursor = function() {
                        return this.cursorState;
                };

                (function(self, setKeyUp, setKeyDown) {

                        document.onkeydown = function(e) {
                                if(!_.isUndefined(self.keyState[e.which])) {
                                        setKeyDown(e.which);
                                } else {
                                        // unknown key
                                        //App.Tools.log('Unknown key: ' + e.which);
                                }
                        };
                        document.onkeyup = function(e) {
                                if(!_.isUndefined(self.keyState[e.which])) {
                                        setKeyUp(e.which);
                                }
                        };

                        document.onmousedown = function(e) {
                                setMouseCursor(e.clientX, e.clientY);
                                if(!_.isUndefined(self.mouseState[e.which])) {
                                        setMouseDown(e.which);
                                }
                        };

                        document.onmouseup = function(e) {
                                setMouseCursor(e.clientX, e.clientY);
                                if(!_.isUndefined(self.mouseState[e.which])) {
                                        setMouseUp(e.which);
                                }
                        };

                        document.onmousemove = function(e) {
                                setMouseCursor(e.clientX, e.clientY);
                        };

                        _.each(self.keys, function(val, i) {
                                self.keyState[self.keys[i]] = self.buttonStates.INACTIVE;
                        });

                        _.each(self.mouse, function(val, i) {
                                self.mouseState[self.mouse[i]] = self.buttonStates.INACTIVE;
                        });

                })(this, setKeyUp, setKeyDown);

                this.keysReset = function() {
                        var self = this;
                        _.each(self.keys, function(val, i) {
                                if(self.keyState[self.keys[i]] == self.buttonStates.UP) {
                                        self.keyState[self.keys[i]] = self.buttonStates.INACTIVE;
                                }
                        });
                        _.each(self.mouse, function(val, i) {
                                if(self.mouseState[self.mouse[i]] == self.buttonStates.UP) {
                                        self.mouseState[self.mouse[i]] = self.buttonStates.INACTIVE;
                                }
                        });
                };
        };
        
        root.App.Objects.Controls = controls;

})(this);
