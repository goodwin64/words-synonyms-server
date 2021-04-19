const Hapi = require('@hapi/hapi');

const intersection = require('./intersection');
const { parseThesaurus } = require('./parsers/parseThesaurus');
const { htmlToDocument } = require('./htmlToDocument');
const { fetchPageContent } = require('./fetchPageContent');

async function fetchThesaurusWords(word) {
  return fetchPageContent(`https://kartaslov.ru/карта-слова/тезаурус/${word}`)
    .then(htmlToDocument)
    .then(parseThesaurus);
}

async function findCommonWords(word1, word2) {
  const [words1, words2] = await Promise.all([
    fetchThesaurusWords(word1),
    fetchThesaurusWords(word2),
  ]);
  return Array.from(intersection(words1, words2));
}


const startServer = async () => {

  const server = Hapi.server({
    port: 8000,
    host: 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/',
    handler: async (req, h) => {
      const wordsList = req.payload.words || [];
      const commonWords = await findCommonWords(...wordsList);
      return commonWords.join();
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

startServer();
