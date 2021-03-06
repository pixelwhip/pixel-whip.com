// Generated on 2013-11-14 using generator-webapp 0.4.1
'use strict';
var LIVERELOAD_PORT = 35728;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Allow configuration to be distributed across files.
  function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: path}).forEach(function(option) {
      key = option.replace(/\.js$/,'');
      object[key] = require(path + option);
    });

    return object;
  }

  // configurable paths
  var yeomanConfig = {
    app: 'src',
    dist: 'dist',
    tmp: '.tmp'
  };

  var config = {
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('package.json'),
    env: process.env,
    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      scripts: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['copy:scripts']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      assemble: {
        files: [
          '<%= yeoman.app %>/**/*.{hbs,json,yml,md}',
          '<%= yeoman.app %>/helpers/**/*.js'
        ],
        tasks: ['assemble']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.dist %>/*.html',
          '<%= yeoman.dist %>/assets/styles/{,*/}*.css',
          '<%= yeoman.dist %>/assets/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9002,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'dist'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    concurrent: {
      server: [
        'compass',
        'copy:styles',
        'copy:scripts',
      ],
      dist: [
        'compass',
        'copy:dist',
        'copy:styles',
        'copy:scripts',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    }
  };

  // Merge task configuration from ./tasks/options
  grunt.util._.extend(config, loadConfig('./tasks/options/'));

  grunt.loadTasks('tasks'); // Loads tasks in `tasks/` folder
  grunt.initConfig(config);

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'assemble',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'assemble',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'uglify',
    'cssmin',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);
};
