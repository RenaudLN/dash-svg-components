'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const dataPath = './data/attributes.json';

function extractElements($) {
  const $index = $('#SVG_elements_A_to_Z').next('.index');

  const elements = $index.find('ul>li>a').map((i, row) => {
    const description = row.attribs.title;
    const tag = row.children[0].children[0].data;
    const element = {
      description,
      tag,
    };
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

function promiseElements(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error) {
        throw error;
      }
      if (response.statusCode !== 200) {
        reject(`GET failed: ${response.statusCode}`);
      }
      const $ = cheerio.load(html);
      const elements = extractElements($);
      resolve(elements);
    });
  });
}

function promiseAttributes(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error) {
        throw error;
      }
      if (response.statusCode !== 200) {
        reject(`GET failed: ${response.statusCode}`);
      }
      const $ = cheerio.load(html);
      const attributes = extractAttributes($);
      resolve(attributes);
    });
  });
}

const promises = [
  promiseElements('https://developer.mozilla.org/en-US/docs/Web/SVG/Element'),
  promiseAttributes(
    'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute'
  ),
];

Promise.all(promises)
  .then(values => {
    const [elements, attributes] = values;
    const out = {
      elements,
      attributes,
    };
    // Print out JSON with 4-space indentation formatting.
    // http://stackoverflow.com/a/11276104
    fs.writeFileSync(dataPath, JSON.stringify(out, null, 4));
  })
  .catch(err => {
    console.log(`${err}`);
  });
