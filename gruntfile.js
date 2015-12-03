/// <reference path="typings/gruntjs/gruntjs.d.ts"/>
var grunt = require('grunt');
grunt.initConfig({
    watch: {
        sass: {
            files: ['assets/css/*.scss'],
            tasks: ['sass'],
            options: {
                event: 'all'
            }
        },
        typescript: {
            files: ['assets/js/*.ts'],
            tasks: ['typescript'],
            options: {
                event: 'all'
            }
        }
    },
    sass: {
        options: {
            style: 'expanded'
        },
        dist: {
            files: {
                'assets/css/athena.css': 'assets/css/athena.scss'
            }
        }
    },
    typescript: {
        base: {
            src: ['assets/js/*.ts'],
            dest: 'assets/js',
            options: {
                module: 'commonjs',
                target: 'es5',
                sourceMap: true,
                declaration: false
            }
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-typescript');
grunt.registerTask('default', ['watch', 'sass', 'typescript']);
