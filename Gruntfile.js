module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    /*
     * Delete folders
    */

    clean: {
      dist: ['dist']
    },

    /*
     * Compile Sass Files
    */

    sass: {
      options: {
        precision: 7,
         style: 'expanded'
      },
      dist: {
        src: 'src/css/rocket.scss',
        dest: 'dist/css/style.css'
      },
      test: {
        src: 'src/css/test.scss',
        dest: 'dist/css/test.css'
      }
    },

    /*
     * Parse CSS and add vendor prefixes to CSS rules using values from the ”Can I Use“ database.
    */

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 9']
      },
      dist: {
        src: 'dist/css/style.css',
        dest: 'dist/css/style.css'
      }
    },

    /*
     * Combine matching media queries into one media query definition.
    */

    cmq: {
      dist: {
        src: 'dist/css/style.css',
        dest: 'dist/css/style.css'
      }
    },

    /*
     * Compress CSS files.
    */

    cssmin: {
      dist: {
        src: 'dist/css/style.css',
        dest: 'dist/css/style.css'
      }
    },

    /*
     * Linting JavaScript files helps to detect errors and potential problems in your code.
    */

    jshint: {
      options: {
        globals: {
          'smarttabs': true
        }
      },
      src: {
        src: ['src/js/script.js']
      }
    },

    /*
     * Concatenate JavaScript files
    */

    concat: {
      options: {
        stripBanners: false
      },
      script: {
        src: ['src/js/script.js'],
        dest: 'dist/js/script.js'
      }
    },

    /*
     * Minify JavaScript files
    */

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

    /*
     * Optimimze png and jpg images
    */

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

    /*
     * Copy other files and folders
    */

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
      normalize: {
        src: 'src/css/imports/Normalize/normalize.css',
        dest: 'src/css/imports/_normalize.scss'
      }
    },

    /*
     * Bake static pages for production while using modular files while in development.
    */

    bake: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist/'}
        ]
      },
    },

    /*
     * start a local connect server for testing
    */

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 3000,
          base: 'dist'
        }
      }
    },

    /*
     * Watch files for changes and execute relevant tasks
    */

    watch: {

      css: {
        files: ['src/**/*.scss'],
        tasks: ['sass', 'autoprefixer', 'cmq', 'cssmin'],
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
        files: ['src/**/*.html'],
        tasks: ['bake'],
        options: {
          nospawn: true,
          livereload: true
        }
      },

      images: {
        files: ['src/**/*.png', 'src/**/*.jpg'],
        tasks: ['imagemin'],
        options: {
          nospawn: true,
          livereload: true
        }
      },

      copy: {
        files: ['src/**/*.gif', 'src/**/*.svg', 'src/**/*.ico'],
        tasks: ['copy:images'],
        options: {
          nospawn: true,
          livereload: true
        }
      }

    }
  });

  /*
   * Load the plugins that provide the tasks we specified in package.json.
  */

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-bake');

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  /*
   * Default task runs server and watcher
  */
  grunt.registerTask('default', ['connect', 'watch']);

  /*
   * Build task builds everything once
  */
  grunt.registerTask('build', ['clean',
                               'copy:normalize',
                               'sass',
                               'autoprefixer',
                               'cmq',
                               'cssmin',
                               'bake',
                               'jshint',
                               'concat',
                               'uglify',
                               'imagemin',
                               'copy'
                              ]);
};
