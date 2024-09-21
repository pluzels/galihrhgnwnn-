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

        // Streaming audio
        const options = {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
          }
        };

        const audioStream = ytdl(videoUrl, options);

        const result = {
          title: video.title,
          thumb: video.thumbnail,
          channel: video.author.name,
          published: video.ago,
          views: video.views,
          streamUrl: audioStream // Stream audio langsung
        };

        resolve(result);
      }).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playaudio; // Ekspor fungsi playaudio
