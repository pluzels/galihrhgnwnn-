const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

async function playaudio(query) {
  return new Promise((resolve, reject) => {
    try {
      // Cari video menggunakan yt-search
      yts(query).then(data => {
        const video = data.videos[0]; // Ambil video pertama dari hasil pencarian
        if (!video) {
          return reject(new Error('Video not found'));
        }

        const videoUrl = video.url;

        // Menggunakan ytdl-core untuk mendapatkan info audio
        ytdl.getInfo(videoUrl).then(info => {
          const formats = info.formats;
          const audioFormats = formats.filter(format => format.mimeType && format.mimeType.includes('audio/webm')); // Filter audio format

          if (!audioFormats.length) {
            return reject(new Error('No audio formats found'));
          }

          const bestAudio = audioFormats[0]; // Ambil format audio terbaik

          const result = {
            title: video.title,
            thumb: video.thumbnail,
            channel: video.author.name,
            published: video.ago,
            views: video.views,
            url: bestAudio.url // URL audio yang bisa digunakan untuk mendownload
          };

          resolve(result);
        }).catch(reject); // Tangani kesalahan saat mengambil info dengan ytdl-core
      }).catch(reject); // Tangani kesalahan saat pencarian dengan yt-search
    } catch (error) {
      reject(error); // Tangani kesalahan lainnya
    }
  });
}

module.exports = playaudio;
