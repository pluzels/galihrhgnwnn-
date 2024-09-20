const yts = require('yt-search');

async function ytsearch(query) {
  return new Promise((resolve, reject) => {
    // Menggunakan yt-search untuk melakukan pencarian berdasarkan query
    yts(query)
      .then(data => {
        const videos = data.videos.slice(0, 10); // Ambil 10 hasil pertama dari pencarian

        if (videos.length === 0) {
          return reject(new Error('No videos found'));
        }

        // Format setiap hasil video
        const results = videos.map(video => ({
          title: video.title,
          thumb: video.thumbnail,
          channel: video.author.name,
          published: video.ago,
          views: video.views,
          url: video.url // URL video
        }));

        resolve(results); // Kembalikan array dengan 10 hasil video
      })
      .catch(reject); // Tangani kesalahan jika ada
  });
}

module.exports = ytsearch;
