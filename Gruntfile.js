module.exports = function(grunt) {

        grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'), 
                dirs: {
                        src: 'app', 
                        dest: 'build/targets/web'
                }, 
                jshint: {
                        all: [ '<%= dirs.src %>/game/**.js' ], 
                }, 
                concat: {
                        options: {
                                separator: ';'
                        },
                        dist: {
                                src: [ 
                                        '<%= dirs.src %>/lib/*.js', 
                                        '<%= dirs.src %>/game/*.js', 
                                        '<%= dirs.src %>/game/*/*.js' 
                                ], 
                                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
                        }
                },
                fakeuglify: {
                        options: {
                                src: '<%= dirs.dest %>/<%= pkg.name %>.js', 
                                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
                        },
                        windows: {}
                }, 
                uglify: {
                        dist: {
                                src: '<%= dirs.dest %>/<%= pkg.name %>.js', 
                                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
                        }
                },
                buildjs: {
                        options: {
                                src: [ '<%= dirs.dest %>/**' ], // this is actually used for the copy source
                                dest: '<%= dirs.dest %>', 
                                jsDelete: '<%= dirs.dest %>/<%= pkg.name %>.js'
                        },
                        default: {}
                }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-compress');

        // default target will build the web version
        grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'buildjs']);

        grunt.registerMultiTask('fakeuglify', 'Pretend to uglify', function(){
                grunt.file.copy(this.options().src, this.options().dest);
        });

        // build common items (js/index/assets etc)
        grunt.registerMultiTask('buildjs', 'Build the web app', function(){
                
                // build the distributable index file
                var indexTpl = grunt.file.read('build/resources/common/index.tpl'), 
                    index = grunt.template.process(indexTpl), 
                    targetDir = this.options().dest;

                grunt.file.write(targetDir + '/index.html', index);

                // copy assets
                grunt.file.recurse('app/assets', function(abspath, rootdir, subdir, filename) {
                        grunt.file.copy(abspath, targetDir + '/assets/' + subdir + '/' + filename);
                });

                // delete the non-monified js
                grunt.file.delete(this.options().jsDelete);
        });
};
