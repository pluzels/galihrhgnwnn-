const yts = require('yt-search');
const playdl = require('play-dl');

async function playMusic(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await yts(query);
      const video = data.videos[0];
      if (!video) {
        return reject(new Error('lagu tidak ditemukan.'));
      }

      // Dapatkan stream audio dari video menggunakan playdl.stream
      const stream = await playdl.stream(video.url);

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: stream.url, // Link stream langsung
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
