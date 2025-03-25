module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ";",
            },
            dist: {
                src: ["src/js/*.js"],
                dest: "dist/js/build.js"
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'dist/js/build.min.js': ['dist/js/build.js']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/js/**/*.js']
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/css/build.min.css': ['src/css/**/*.css']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/js/*.js', 'src/css/*.css'],
                tasks: ['concat', 'uglify', 'jshint', 'cssmin'],
                options: {
                    spawn: false //变量更新   true:全量更新
                }
            }
        }
    });

    //grunt任务执行时去加载对应的任务插件
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-contrib-watch');

    //注册grunt的默认任务,grunt执行任务是同步的
    grunt.registerTask("default", ['concat', 'uglify', 'jshint', 'cssmin']);
    grunt.registerTask("myWatch", ['default', 'watch']);
};