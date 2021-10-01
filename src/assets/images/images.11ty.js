console.log('MINIFY: images');

const fs = require('fs');
const path = require('path');

const imagemin = require('imagemin');
const imageminJPEG = require('imagemin-mozjpeg');
const imageminPNG = require('imagemin-pngquant');
const imageminSVG = require('imagemin-svgo'); // https://github.com/svg/svgo#what-it-can-do
const imageminWebP = require('imagemin-webp'); // https://github.com/imagemin/imagemin-webp#api

// const imageminGuetzli = require('imagemin-guetzli'); // https://github.com/imagemin/imagemin-guetzli#api

// const imageminPNGquant = require('imagemin-pngquant'); // https://github.com/imagemin/imagemin-pngquant#api
// const imageminOptiPNG = require('imagemin-optipng'); // https://github.com/imagemin/imagemin-optipng#api

module.exports = class {
  async data () {
    const rawFilepath = 'src/_includes/assets/images/';
    return {
      rawFilepath
    };
  };

  async render ({ rawFilepath }) {
    const files = await imagemin([rawFilepath + '*.{jpg,jpeg,png,gif,svg,webp}'], {
      destination: 'dist/assets/images',
      plugins: [
        imageminJPEG(),
        imageminPNG({
          quality: [0.6, 0.8]
        }),
        imageminSVG(),
        // imageminWebP() // Only include if you wan't ex. jpeg and png images converted to webp
      ]
    });
  };
}
