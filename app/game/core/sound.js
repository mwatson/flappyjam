(function(root){

        var sound = function() {

                var sfxVolume = 0.8, 
                    musicVolume = 0.5;

                this.play = function(soundId) {

                        if(!_.isUndefined(App.Assets.Sounds[soundId])) {
                                App.Assets.Sounds[soundId].volume = sfxVolume;
                                App.Assets.Sounds[soundId].play();

                        } else if(!_.isUndefined(App.Assets.SoundQueues[soundId])) {
                                App.Assets.SoundQueues[soundId].play();
                        }
                };

                this.playSong = function(songId, loop) {
                        if(!App.Assets.Music[songId].playing) {
                                App.Assets.Music[songId].addEventListener('canplay', function() {
                                        App.Assets.Music[songId].playing = true;
                                        App.Assets.Music[songId].volume = musicVolume;
                                        App.Assets.Music[songId].play();
                                });
                                if(loop) {
                                        App.Assets.Music[songId].addEventListener('ended', function(){
                                                App.Assets.Music[songId].currentTime = 0;
                                                App.Assets.Music[songId].play();
                                        }, false);
                                }
                                App.Assets.Music[songId].load();
                        }
                };

                this.toggleMuteSong = function(songId) {
                        if(!_.isUndefined(App.Assets.Music[songId])) {
                                if(!App.Assets.Music[songId].volume) {
                                        App.Assets.Music[songId].volume = musicVolume;
                                } else {
                                        App.Assets.Music[songId].volume = 0;
                                }
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
