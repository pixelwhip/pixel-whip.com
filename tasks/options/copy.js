module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= yeoman.app %>',
      dest: '<%= yeoman.dist %>',
      src: [
        '*.{ico,png,txt}',
        '.htaccess',
        'images/{,*/}*.{webp,gif,jpg,png}',
        'styles/fonts/{,*/}*.*',
        'CNAME'
      ]
    }]
  },
  styles: {
    expand: true,
    dot: true,
    cwd: '<%= yeoman.app %>/styles',
    dest: '<%= yeoman.dist %>/assets/styles/',
    src: '{,*/}*.css'
  },
  scripts: {
    expand: true,
    dot: true,
    cwd: '<%= yeoman.app %>/scripts',
    dest: '<%= yeoman.dist %>/assets/scripts/',
    src: '**/*.js'
  },
  bower: {
    expand: true,
    dot: true,
    cwd: '<%= yeoman.app %>/bower_components',
    dest: '<%= yeoman.dist %>/bower_components/',
    src: '**/*.{js,css}'
  },
  core: {
    expand: true,
    dot: true,
    cwd: '<%= yeoman.app %>',
    dest: '<%= yeoman.tmp %>/src/',
    src: '**/*'
  },
  project: {
    expand: true,
    dot: true,
    cwd: 'project',
    dest: '<%= yeoman.tmp %>/src/',
    src: '**/*'
  }
};
