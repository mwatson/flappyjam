(function(root){

        var levels = [];

        // use levels.push so spacing is a little better

        // level 0
        levels.push({
                build: function(width, height) {
                        var columns = {};
                        // add in columns (evenly spaced)
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += 6) {
                                        columns['col_' + x] = x;
                                }
                        }
                        return columns;
                }, 
                params: {
                        gap: 2, 
                        heightMax: 4, 
                        heightDiff: 2, 
                        colors: {
                                main: { r: 52, g: 140, b: 1 }, 
                                shadow: { r: 161, g: 212, b: 21 },
                                bgColor: { r: 0, g: 0, b: 0 }, 
                                bgGrid: { r: 0, g: 48, b: 0 }
                        }
                }
        });

        // level 1
        levels.push({
                build: function(width, height) {
                        var columns = {};
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += 6) {
                                        columns['col_' + x] = x;
                                }
                        }
                        return columns;
                }, 
                params: {
                        gap: 2, 
                        heightMax: 4, 
                        heightDiff: 3, 
                        colors: {
                                main: { r: 1, g: 76, b: 140 }, 
                                shadow: { r: 101, g: 213, b: 233 },
                                bgColor: { r: 0, g: 0, b: 0 }, 
                                bgGrid: { r: 0, g: 39, b: 66 }
                        }
                }
        });

        // level 2
        levels.push({
                build: function(width, height) {
                        var eo = [ 8, 4 ], ctr = 0, columns = {};
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += eo[ctr % 2]) {
                                        columns['col_' + x] = x;
                                        ctr++;
                                }
                        }
                        return columns;
                }, 
                params: {
                        gap: 2, 
                        heightMax: 4, 
                        heightDiff: 2, 
                        colors: {
                                main: { r: 202, g: 19, b: 187 }, 
                                shadow: { r: 220, g: 126, b: 255 },
                                bgColor: { r: 0, g: 0, b: 0 }, 
                                bgGrid: { r: 48, g: 0, b: 66 }
                        }
                }
        });

        // level 3
        levels.push({
                build: function(width, height) {
                        var columns = {};
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += 5) {
                                        columns['col_' + x] = x;
                                }
                        }
                        return columns;
                }, 
                params: {
                        gap: 2, 
                        heightMax: 4, 
                        heightDiff: 1, 
                        colors: {
                                main: { r: 0, g: 0, b: 0 }, 
                                shadow: { r: 202, g: 19, b: 187 },
                                bgColor: { r: 0, g: 43, b: 74 }, 
                                bgGrid: { r: 127, g: 120, b: 0 }
                        }
                }
        });

        // level 4
        levels.push({
                build: function(width, height) {
                        var columns = {};
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += 4) {
                                        columns['col_' + x] = x;
                                }
                        }
                        return columns;
                }, 
                params: {
                        gap: 3, 
                        heightMax: 4, 
                        heightDiff: 1, 
                        colors: {
                                main: { r: 190, g: 0, b: 0 }, 
                                shadow: { r: 255, g: 161, b: 161 },
                                bgColor: { r: 0, g: 0, b: 0 }, 
                                bgGrid: { r: 166, g: 88, b: 0 }
                        }
                }
        });

        root.App.Defaults.Levels = levels;

})(this);
