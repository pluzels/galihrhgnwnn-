const yts = require('yt-search');
const ytdlp = require('yt-dlp-exec');

async function playMusic(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await yts(query);
      const video = data.videos[0];
      if (!video) {
        return reject(new Error('Lagu tidak ditemukan.'));
      }

      // Dapatkan stream audio dari video menggunakan yt-dlp-exec
      const result = await ytdlp(video.url, {
        format: 'bestaudio/best',
        extract_audio: true,
        no_warnings: true,
      });

      const streamUrl = result.url; // Link stream langsung

      const response = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: streamUrl,
      };

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
