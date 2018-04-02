const request = require('request');
const cheerio = require('cheerio');

const htmlUrl = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element';

function extractElements($) {
    const $index = $('#SVG_elements_A_to_Z').next('.index');

    const elements = $index.find('ul>li>a').map((i, row) => {
        const description = row.attribs.title;
        const tag = row.children[0].children[0].data;
        const element = {
            description,
            tag
        }
        return element;
    });

    return elements.get();
}

request(htmlUrl, (error, response, html) => {
  if (error) {
      throw error;
  }
  const $ = cheerio.load(html);
  const elements = extractElements($);
  console.log(elements);
});
