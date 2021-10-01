console.log('MINIFY: styles');

const fs = require('fs');
const path = require('path');

const postcss = require('postcss');
const postcssimport = require('postcss-import');
const postcsspresetenv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const cssmqpacker = require('css-mqpacker');
const cssnano = require('cssnano');

const plugins = [
  postcssimport(),
  postcsspresetenv(),
  autoprefixer(),
  cssmqpacker(),
  cssnano()
];

module.exports = class {
  async data () {
    const rawFilepath = path.join(__dirname, '../../_includes/assets/css/styles.css');
    return {
      permalink: 'assets/css/formidling-langs-kysten.min.css',
      rawFilepath,
      rawCSS: await fs.readFileSync(rawFilepath, 'utf8')
    };
  };

  async render ({ rawCSS, rawFilepath }) {
    return await postcss(plugins)
    .process(rawCSS, {
      from: rawFilepath
    })
    .then((result) => result.css);
  };
}
