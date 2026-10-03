const https = require('https');

function searchUnsplash(query) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`\n--- Results for "${query}" ---`);
        json.results.forEach(img => {
          console.log(`ID: ${img.id}`);
          console.log(`URL: ${img.urls.regular}`);
          console.log(`Desc: ${img.alt_description}`);
          console.log('');
        });
      } catch (e) { console.error(e); }
    });
  }).on('error', console.error);
}

searchUnsplash('messy hair man');
searchUnsplash('fade haircut man');
searchUnsplash('frizzy hair woman back');
searchUnsplash('straight shiny hair back');
searchUnsplash('bob haircut woman');
searchUnsplash('balayage hair back');
