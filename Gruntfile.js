/* global module:false */
module.exports = function(grunt) {
    var port = grunt.option('port') || 8000;

    // Project configuration
    grunt.initConfig({

        uglify: {
          dev: {
            options: {
              mangle: {
                reserved: ['jQuery']
              }
            },
            files: [{
              expand: true,
              src: ['dist/js/*.js', '!dist/js/*.min.js'],
              dest: 'dist',
              cwd: '.',
              rename: function (dst, src) {
                return src.replace('.js', '.min.js');
              }
            }]
          }
        },

        sass: {
            main: {
                files: {
                    'dist/css/application.css': 'src/scss/application.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'}),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'dist/css/*.css'
            }
        },

        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                node: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                expr: true,
                globals: {
                    head: false,
                    module: false,
                    console: false,
                    unescape: false
                }
            },
            files: [ 'Gruntfile.js' ]
        },

        connect: {
            server: {
                options: {
                    port: port,
                    base: '.'
                }
            }
        },

        zip: {
            'reveal-js-presentation.zip': [
                'index.html',
                'src/css/**',
                'js/**',
                'dist/**',
                'images/**',
                'plugin/**'
            ]
        },

        watch: {
            main: {
                files: [ 'src/**/*' ],
                tasks: 'default'
            },
            css: {
                files: [ 'src/scss/**/*.scss' ],
                tasks: 'sass'
            },
            theme: {
                files: [ 'src/css/theme/source/*.scss', 'src/css/theme/template/*.scss' ],
                tasks: 'themes'
            }
        },

        browserSync: {
            bsFiles: {
                src : [
                    'dist/css/**/*.css',
                    'dist/*.html'
                ]
            },
            options: {
                watchTask: true,
                server: './dist'
            }
        },

        copy: {
          main: {
            files: [
              {
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'dist'
              },
              {
                expand: true,
                cwd: 'src/fonts/',
                src: ['**'],
                dest: 'dist/fonts'
              },
              {
                expand: true,
                cwd: 'src/plugins/',
                src: ['**'],
                dest: 'dist/plugins'
              },
              {
                expand: true,
                cwd: 'src/img/',
                src: ['**'],
                dest: 'dist/img'
              },
              {
                expand: true,
                cwd: 'src/js/',
                src: ['**'],
                dest: 'dist/js'
              }
            ]
          }
        },

        clean: ['dist']

    });

    // Dependencies
    grunt.loadNpmTasks( 'grunt-browser-sync' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    // grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-postcss' );
    grunt.loadNpmTasks( 'grunt-zip' );

    // Default task
    grunt.registerTask( 'default', [ 'clean', 'copy', 'jshint', 'sass', 'postcss', 'uglify' ] );

    // Start Server
    grunt.registerTask( 'server', [ 'default', 'browserSync', 'watch' ] );

    // Theme task
    grunt.registerTask( 'themes', [ 'sass' ] );

    // Package presentation to archive
    grunt.registerTask( 'package', [ 'default', 'zip' ] );

};
