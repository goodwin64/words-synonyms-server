const fetch = require('node-fetch');
const jsDom = require('jsdom');
const Hapi = require('@hapi/hapi');

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
  return Array.from(intersection(connections1, connections2));
}


const startServer = async () => {

  const server = Hapi.server({
    port: 8000,
    host: 'localhost'
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: async (req, h) => {
      const wordsList = req.payload.words || [];
      const commonWords = await findCommonWords(...wordsList);
      return commonWords.join();
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

startServer()
