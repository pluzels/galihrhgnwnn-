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

      // Ambil URL audio stream dari play-dl
      const videoInfo = await playdl.video_info(video.url);
      const audioFormat = playdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: audioFormat.url, // Link langsung ke file audio yang bisa di-play
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
