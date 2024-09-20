const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

async function playaudio(query) {
  return new Promise((resolve, reject) => {
    try {
      yts(query).then(data => {
        const video = data.videos[0];
        if (!video) {
          return reject(new Error('Video not found'));
        }

        const videoUrl = video.url;

        // Menggunakan ytdl-core dengan User-Agent
        const options = {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
          }
        };

        ytdl(videoUrl, options).then(info => {
          const formats = info.formats;
          const audioFormats = formats.filter(format => format.mimeType && format.mimeType.includes('audio/webm'));

          if (!audioFormats.length) {
            return reject(new Error('No audio formats found'));
          }

          const bestAudio = audioFormats[0];

          const result = {
            title: video.title,
            thumb: video.thumbnail,
            channel: video.author.name,
            published: video.ago,
            views: video.views,
            url: bestAudio.url
          };

          resolve(result);
        }).catch(reject);
      }).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playaudio;
