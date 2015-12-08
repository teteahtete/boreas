/// <reference path="typings/gruntjs/gruntjs.d.ts"/>

import grunt = require('grunt');

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
        },
        uglify: {
            files: ['assets/js/*.js','!assets/js/*.min.js'],
            tasks: ['uglify'],
            options: {
                event: 'all'
            }
        },
        cssmin:{
            files: ['!assets/css/*.min.css', 'assets/css/.css'],
            tasks: ['cssmin'],
            options: {
                event: 'all'
            }
        }
    },
	sass: {
        options: {
            style: 'expanded'
            // ,lineNumbers: true
        },
        dist: {
            files: {
                'assets/css/athena.css': 'assets/css/athena.scss'
            }
        }
    },
    cssmin: {
        sitecss:{
            options: {
                banner: '/* My minified css file */'  
            },
            files: {
                'assets/css/athena.min.css' : ['assets/css/athena.css']
            }
        }
    },
    typescript: {
        base: {
        src: ['assets/js/*.ts'],
        dest: 'assets/js',
        options: {
            module: 'commonjs', 
            target: 'es5', //or es3
            sourceMap: true,
            declaration: false
        }
        }
    },
    uglify: {
        options: {
            compress: true,
            sourceMap: true
        },
        applib: {
            src: ['assets/js/*.js', '!assets/js/*.min.js'],
            dest: 'assets/js/athena.min.js'
        }
    }
    });

grunt.loadNpmTasks('grunt-contrib-watch');    
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-typescript');
grunt.registerTask('default', ['watch']);
grunt.registerTask('transpile', ['sass','typescript']);
grunt.registerTask('bundle', ['uglify','cssmin']);

