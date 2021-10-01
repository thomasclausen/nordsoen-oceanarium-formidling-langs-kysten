console.log('MINIFY: scripts');

const fs = require('fs');
const path = require('path');

const uglify = require('uglify-es');

module.exports = class {
  async data () {
    const rawFilepath = path.join(__dirname, '../../_includes/assets/js/scripts.js');
    return {
      permalink: 'assets/js/formidling-langs-kysten.min.js',
      rawFilepath,
      rawJS: await fs.readFileSync(rawFilepath, 'utf8')
    };
  };

  async render ({ rawJS, rawFilepath }) {
    return await uglify.minify(rawJS).code;
  };
}
