(function(root) {

        // simple definitions manager
        // usage: App.Definitions.get('Entity', 'player');
        var definitions = function() {

                this.setAllDefaults = function() {
                        var self = this;
                        _.each(App.Defaults, function(defaultData, set){
                                self.setDefaults(set);
                        });
                };

                this.setDefaults = function(set) {
                        if(_.isFunction(App.Defaults[set])) {
                                App.Defs[set] = App.Defaults[set]();
                        } else if(_.isArray(App.Defaults[set])) {
                                App.Defs[set] = _.cloneDeep(App.Defaults[set]);
                                //App.Defs[set] = _.extend([], App.Defaults[set]);
                        } else {
                                App.Defs[set] = _.cloneDeep(App.Defaults[set]);
                                //App.Defs[set] = _.extend({}, App.Defaults[set]);
                        }
                        return true;
                };

                this.get = function(set, name) {
                        if(!_.isUndefined(App.Defaults[set])) {
                                if(!_.isUndefined(App.Defaults[set][name])) {
                                        return App.Defaults[set][name];
                                }
                                App.Tools.log("Couldn't find name " + name);
                        }
                        App.Tools.log("Couldn't find set " + set);
                        
                        return {};
                };

                this.init = (function(self){
                        self.setAllDefaults();
                })(this);
        };

        root.App.Objects.Definitions = definitions;

})(this);
