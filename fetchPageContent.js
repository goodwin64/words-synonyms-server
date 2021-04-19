function fetchPageContent(url) {
  const encodedUrl = encodeURI(url);
  return fetch(encodedUrl).then(r => r.text());
}

module.exports.fetchPageContent = fetchPageContent;
