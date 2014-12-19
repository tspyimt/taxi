module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        connect: {
            options: {
                port: 9999,
                hostname: '0.0.0.0'
            },
            keepalive: true
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '.',                             // Project root
                    src: ['views/**/*.html', '*.html'],                        // Source
                    dest: 'dist/'
                }]
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['scripts/**/*.js', '*.js'],
                    dest: 'dist/'
                }]
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['images/**/*.{png,jpg,gif}', '*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },
        filerev: {
            dist: {
                src: [
                    'dist/scripts/{,*/}*.js',
                    'dist/styles/{,*/}*.css',
                    'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'dist/styles/fonts/*'
                ]
            }
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'dist/',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        usemin: {
            html: ['dist/{,*/}*.html'],
            css: ['dist/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['dist','dist/images']
            }
        }



    });



    grunt.registerTask('default', ['sayHello']);

    grunt.registerTask('minhtml', ['htmlmin:dist']);
    grunt.registerTask('minjs', ['uglify:dist']);
    grunt.registerTask('minimg', ['imagemin:dist']);

    grunt.registerTask('server', function () {
        console.log('Greetings !!!');
        grunt.task.run([
            'connect::keepalive'
        ])
    });

    grunt.registerTask('dist', function () {
        grunt.task.run([
            'useminPrepare:html',
            'htmlmin:dist',
            'uglify:dist',
            'imagemin:dist',
            'filerev',
            'usemin:html'
        ]);

    })
};
