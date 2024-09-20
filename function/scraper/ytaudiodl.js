const yts = require('yt-search');

async function ytsearch(query) {
  return new Promise((resolve, reject) => {
    // Menggunakan yt-search untuk melakukan pencarian berdasarkan query
    yts(query)
      .then(data => {
        const video = data.videos[0]; // Ambil video pertama dari hasil pencarian
        if (!video) {
          return reject(new Error('Video not found'));
        }

        const result = {
          title: video.title,
          thumb: video.thumbnail,
          channel: video.author.name,
          published: video.ago,
          views: video.views,
          url: video.url // URL video
        };

        resolve(result); // Kembalikan hasilnya
      })
      .catch(reject); // Tangani kesalahan jika ada
  });
}

module.exports = ytsearch;
