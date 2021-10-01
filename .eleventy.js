const fs = require('fs');

// Import filters
const markdownFilter = require('./src/utils/filters/markdown.js'); //

// Import shortcodes

// Import transforms
const htmlTransform = require('./src/utils/transforms/minify-html.js');

// Import plugins
const inclusiveLanguage = require('@11ty/eleventy-plugin-inclusive-language');
const markdown = require('markdown-it');

module.exports = (eleventyConfig) => {
  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Set library
  let markdownLibrary = markdown({
    html: true,
    linkify: true
  });

  eleventyConfig.setLibrary('md', markdownLibrary);

  // Add layout aliases
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');

  // Add filters
  eleventyConfig.addFilter('markdownFilter', markdownFilter);

  // Add shortcodes

  // Add Transforms
  eleventyConfig.addTransform('htmlmin', htmlTransform);

  // Add passthroughs
  eleventyConfig.addPassthroughCopy('./src/assets/media');
  eleventyConfig.addPassthroughCopy('./src/assets/webfonts');

  // Add plugins
  eleventyConfig.addPlugin(inclusiveLanguage, {
    words: 'ganske enkelt, helt enkelt, åbenlyst, tydeligvis, stort set, dybest set, selvfølgelig, klart, helt klart, bare, alle ved, ved alle, dog, let'
  });

  // Custom collections

  // 404
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(error, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware("*", (request, response) => {
          // Provides the 404 content without redirect.
          response.write(content_404);
          response.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', '11ty.js'],
    passthroughFileCopy: true
  };
};
