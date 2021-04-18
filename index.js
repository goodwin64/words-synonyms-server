const fetch = require('node-fetch');
const jsDom = require('jsdom');
const intersection = require('./intersection');

async function findConnections(word) {
  const url = encodeURI(`https://kartaslov.ru/карта-слова/тезаурус/${word}`);

  return fetch(url)
    .then(r => r.text())
    .then(htmlString => {
      const dom = new jsDom.JSDOM(htmlString);
      const document = dom.window.document;
      const links = [...document.querySelectorAll('.v4-cross-list-item > a')];
      const uniqueWords = new Set(links.map(a => a.innerHTML));
      return uniqueWords;
    });
}

async function findCommonWords(word1, word2) {
  const [
    connections1,
    connections2,
  ] = await Promise.all([
    findConnections(word1),
    findConnections(word2),
  ]);
  return intersection(connections1, connections2);
}

async function main() {
  const res = await findCommonWords('домино', 'лосось')
  console.log(res);
}

main();
