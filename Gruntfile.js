/* jshint node: true */
module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      dist: ['dist']
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        src: 'src/css/style.scss',
        dest: 'dist/css/style.css',
      }
    },

    jshint: {
      src: {
        src: ['src/js/script.js']
      }
    },

    concat: {
      options: {
        stripBanners: false
      },
      script: {
        src: ['src/js/script.js'
        ],
        dest: 'dist/js/script.js'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      js: {
        files: {
          '<%= concat.script.dest %>': ['<%= concat.script.dest %>']
        }
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {expand: true, cwd: 'src/', src: ['**/*.png', '**/*.jpg'], dest: 'dist/'}
        ]
      }
    },

    copy: {
      images: {
        files: [
          {expand: true, cwd: 'src/', src: ['**/*.gif', '**/*.svg', '**/*.ico'], dest: 'dist/'}
        ]
      },
      videos: {
        files: [
          {expand: true, cwd: 'src/', src: ['**/*.mp4', '**/*.webm'], dest: 'dist/'}
        ]
      },
      fonts: {
        files: [
          {expand: true, cwd: 'src/', src: ['**/*.eot', '**/*.ttf', '**/*.woff'], dest: 'dist/'}
        ]
      },
      dotfiles: {
        files: [
          {expand: true, cwd: 'src/', src: ['.htaccess'], dest: 'dist/'}
        ]
      },
      others: {
        files: [
          {expand: true, cwd: 'src/', src: ['.htaccess', '**/*.php', '**/*.json', '**/*.txt'], dest: 'dist/'}
        ]
      }
    },

    bake: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist/'}
        ]
      },
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 3000,
          base: 'dist'
        }
      }
    },

    // Tasks being executed with 'grunt watch'
    watch: {

      css: {
        files: ['src/**/*.scss'],
        tasks: ['sass'],
        options: {
          nospawn: true,
          livereload: true
        }
      },

      js: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify'],
        options: {
          nospawn: true,
          livereload: true
        }
      },

      html: {
        files: ['src/**/*.html', ],
        tasks: ['bake'],
        options: {
          nospawn: true,
          livereload: true
        }
      }

    }
  });

  // Load the plugins that provide the tasks we specified in package.json.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-bake');

  // Run server and watcher
  grunt.registerTask('default', ['connect', 'watch']);
  // Build everything
  grunt.registerTask('build', ['clean', 'sass', 'jshint', 'concat', 'uglify', 'imagemin', 'copy', 'bake']);

};