(function(root){

        var statsSave = {

                name: 'virtualbird-gamestats', 

                save: function() {
                        return {
                                best: App.Game.best
                        };
                }, 

                load: function(saveData) {
                        if(!saveData) {
                                return;
                        }

                        if(!_.isUndefined(saveData.best)) {
                                _.each(saveData.best, function(statVal, statName){
                                        App.Game.best[statName] = statVal;
                                });
                        }
                }
        };

        root.App.Defaults.Saves_StatsSave = statsSave;

})(this);
