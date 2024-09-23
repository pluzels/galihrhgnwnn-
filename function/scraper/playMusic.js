const yts = require('yt-search');
const yt = require('ytdl-core');

async function playmusic(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await yts(query);
      const video = data.videos[0];
      
      if (!video) {
        return reject(new Error('Lagu tidak ditemukan.'));
      }

      // Menggunakan ytdl-core untuk mendapatkan link stream audio
      const info = await yt.getInfo(video.url);

      // Memilih format dengan audioonly
      const format = yt.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

      if (!format || !format.url) {
        return reject(new Error('Stream audio tidak tersedia.'));
      }

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: format.url, 
      };

      resolve(result);
    } catch (error) {
      // Menangani error dan memberikan pesan yang lebih informatif
      console.error('Error in playmusic:', error);
      reject(new Error('Terjadi kesalahan saat mengambil data musik.'));
    }
  });
}

module.exports = playmusic;
