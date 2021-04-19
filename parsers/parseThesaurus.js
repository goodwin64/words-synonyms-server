function parseThesaurus(document) {
  const links = [...document.querySelectorAll('.v4-cross-list-item > a')];
  const uniqueWords = new Set(links.map(a => a.innerHTML));
  return uniqueWords;
}

module.exports.parseThesaurus = parseThesaurus;
