const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

async function playMusic(query) {
  return new Promise(async (resolve, reject) => {
    try {
      // Cari video berdasarkan query
      const data = await yts(query);
      const video = data.videos[0];
      if (!video) {
        return reject(new Error('Lagu tidak ditemukan.'));
      }

      // Cek apakah URL video valid
      if (!ytdl.validateURL(video.url)) {
        return reject(new Error('URL video tidak valid.'));
      }

      // Dapatkan stream audio dari video menggunakan @distube/ytdl-core
      const stream = await ytdl(video.url, {
        filter: 'audioonly',
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
          }
        }
      });

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        // Karena @distube/ytdl-core hanya mengembalikan stream, bukan URL langsung,
        // kamu bisa memberikan stream ini ke aplikasi yang bisa memprosesnya.
        audioStream: stream, // Stream ini perlu diproses lebih lanjut untuk diputar
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
