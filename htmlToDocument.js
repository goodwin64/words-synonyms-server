const jsDom = require('jsdom');

function htmlToDocument(htmlString) {
  return new jsDom.JSDOM(htmlString);
}

module.exports.htmlToDocument = htmlToDocument;
