const yts = require('yt-search');
const youtubedl = require('youtube-dl-exec');

async function playmusic(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await yts(query);
      const video = data.videos[0];
      
      if (!video) {
        return reject(new Error('Lagu tidak ditemukan.'));
      }

      // Menggunakan youtube-dl-exec untuk mendapatkan link stream audio
      const info = await youtubedl(video.url, {
        format: 'bestaudio',
        dumpSingleJson: true
      });

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: info.url,  // Mendapatkan link stream langsung
      };

      resolve(result);
    } catch (error) {
      console.error('Error in playmusic:', error);
      reject(new Error('Terjadi kesalahan saat mengambil data musik.'));
    }
  });
}

module.exports = playmusic;
