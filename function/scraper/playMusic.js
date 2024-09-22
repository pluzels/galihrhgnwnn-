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

      // Ambil informasi video dari play-dl
      const videoInfo = await playdl.video_basic_info(video.url);

      // Pastikan formats ada sebelum menggunakan find
      if (!videoInfo || !videoInfo.formats) {
        return reject(new Error('Informasi format tidak tersedia.'));
      }

      // Pilih format audio (biasanya dengan mimeType audio/mp4 atau audio/webm)
      const audioFormat = videoInfo.formats.find(
        format => format.mimeType && format.mimeType.includes('audio/')
      );

      if (!audioFormat) {
        return reject(new Error('Format audio tidak tersedia.'));
      }

      const result = {
        id: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        audio: audioFormat.url, // Link langsung ke file audio
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
