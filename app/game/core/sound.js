(function(root){

        var sound = function() {

                this.AudioContext = null;

                this.filter = null;

                var volume = 0.8;

                this.play = function(soundId) {

                        if(!_.isUndefined(App.Assets.Sounds[soundId])) {
                                if(this.filter) {
                                        this.filter.frequency.value = App.Tools.rand(330, 530);

                                        App.Assets.Sounds[soundId].source.connect(this.filter);
                                        this.filter.connect(this.AudioContext.destination);
                                }

                                App.Assets.Sounds[soundId].volume = volume;
                                App.Assets.Sounds[soundId].play();

                        } else if(!_.isUndefined(App.Assets.SoundQueues[soundId])) {
                                App.Assets.SoundQueues[soundId].play();
                        }
                };

                this.playSong = function(songId) {
                        if(_.isUndefined(App.Assets.Music[songId])) {
                                App.Assets.Music[songId] = new Audio();
                                App.Assets.Music[songId].addEventListener('canplay', function() {
                                        App.Assets.Music[songId].volume = 0.7;
                                        App.Assets.Music[songId].play();
                                });
                                var asset = App.Defs.Assets.Music[songId];
                                App.Assets.Music[songId].src = 'assets/' + asset.rel.mp3;
                                App.Assets.Music[songId].load();
                        }
                };

                this.getVolume = function() {
                        return Math.floor(volume * 10);
                };

                this.setVolume = function(value) {
                        volume = value / 10;
                };

                this.adjustVolume = function(amount) {
                        var vol = volume * 10;
                        vol += amount;
                        if(vol < 0) {
                                vol = 0;
                        } else if(vol > 10) {
                                vol = 10;
                        }

                        volume = vol / 10;
                };

                this.init = (function(self) {
                        window.AudioContext = window.AudioContext || window.webkitAudioContext;
                        self.AudioContext = new AudioContext();

                        self.filter = self.AudioContext.createBiquadFilter();
                        self.filter.type = 1;
                        
                })(this);
        };

        var soundQueue = function(soundList) {

                var toBePlayed    = soundList,
                    alreadyPlayed = [];

                this.play = function() {
                        var sId = App.Tools.rand(0, toBePlayed.length - 1);
                        App.Sound.play(toBePlayed[sId]);
                        alreadyPlayed.push(toBePlayed[sId]);
                        toBePlayed.splice(sId, 1);

                        if(!toBePlayed.length) {
                                toBePlayed = _.extend([], alreadyPlayed);
                                alreadyPlayed = [];
                        }
                };
        };

        root.App.Objects.Sound = sound;
        root.App.Objects.SoundQueue = soundQueue;

})(this);
