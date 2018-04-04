'use strict';

const fs = require('fs')
const request = require('request');
const cheerio = require('cheerio');

const htmlUrlElements = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Element';
const htmlUrlAttributes = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute';

const dataPathElements = './data/elements.json';
const dataPathAttributes = './data/attributes.txt';

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

function extractAttributes($) {
    const $index = $('#SVG_attributes_A_to_Z').next('.index');

    const attributes = $index.find('ul>li>code>a').map((i, row) => {
        const attribute = row.children[0].data;
        return attribute;
    });

    return attributes.get();
}

request(htmlUrlElements, (error, response, html) => {
  if (error) {
      throw error;
  }
  const $ = cheerio.load(html);
  const elements = extractElements($);
  const out = elements;
    // Print out JSON with 4-space indentation formatting.
    // http://stackoverflow.com/a/11276104
    fs.writeFileSync(dataPathElements, JSON.stringify(out, null, 4));
});

request(htmlUrlAttributes, (error, response, html) => {
    if (error) {
        throw error;
    }
    const $ = cheerio.load(html);
    const attributes = extractAttributes($);
    const out = attributes.join('\n');
    fs.writeFileSync(dataPathAttributes, out);
  });
