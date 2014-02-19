(function(root){

        var levels = [];

        // use levels.push so spacing is a little better

        // level 0 (catch all)
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
                }
        });

        // level 1
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
                }
        });

        // level 3
        levels.push({
                build: function(width, height) {
                        var eo = [ 2, 4, 6 ], ctr = 0, columns = {};
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += eo[ctr % 3]) {
                                        columns['col_' + x] = x;
                                        ctr++;
                                }
                        }
                        return columns;
                }
        });

        root.App.Defaults.Levels = levels;

})(this);
