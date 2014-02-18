(function(root){

        var levels = [];

        // use levels.push so spacing is a little better

        // level 1
        levels.push({
                build: function(width, height, map, grid) {
                        // add in columns (evenly spaced)
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += 6) {
                                        map.columns['col_' + x] = x;
                                        App.Game.colScore['col_' + x] = false;
                                }
                        }

                        var c, st = 2, lst = 0;
                        _.each(map.columns, function(val, key){

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
                }
        });

        // level 2
        levels.push({
                build: function(width, height, map, grid) {
                        var eo = [ 4, 8 ], ctr = 0;
                        for(y = 0; y < height; y++) {
                                for(x = 32; x < width - 64; x += eo[ctr % 2]) {

                                        if(_.keys(map.columns).length >= 16) {
                                                break;
                                        }

                                        map.columns['col_' + x] = x;
                                        App.Game.colScore['col_' + x] = false;

                                        ctr++;
                                }

                                if(_.keys(map.columns).length >= 16) {
                                        break;
                                }
                        }

                        var c, st = 2, lst = 0;
                        _.each(map.columns, function(val, key){

                                st = App.Tools.rand(1, 4);
                                while(Math.abs(st - lst) > 1) {
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
                }
        });

        root.App.Defaults.Levels = levels;

})(this);
