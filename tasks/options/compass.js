// Compiles Sass files with Compass.
module.exports = {
  options: {
    sassDir: '<%= yeoman.app %>/styles',
    cssDir: '<%= yeoman.dist %>/assets/styles',
    imagesDir: '<%= yeoman.app %>/images',
    javascriptsDir: '<%= yeoman.app %>/scripts',
    fontsDir: '<%= yeoman.app %>/styles/fonts',
    relativeAssets: false,
    bundleExec: true,
    config: '<%= yeoman.app %>/config.rb'
  },
  server: {
    options: {
      debugInfo: true
    }
  }
};
