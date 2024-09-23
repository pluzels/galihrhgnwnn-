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
      const format = yt.chooseFormat(info.formats, { quality: 'highestaudio' });

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: format.url, // Link stream langsung
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playmusic;
