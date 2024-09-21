const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

async function playMusic(query) {
  return new Promise((resolve, reject) => {
    try {
      // cari video menggunakan yt-search
      yts(query).then(async (data) => {
        const video = data.videos[0]; // ambil video pertama dari hasil pencarian
        if (!video) {
          return reject(new Error('lagu tidak ditemukan.'));
        }

        const videoUrl = video.url;

        // tambahkan options dengan User-Agent yang kamu berikan, dan nonaktifkan chunk download
        const options = {
          dlChunkSize: 0, // mencegah pembuatan file sementara
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
            }
          }
        };

        // dapatkan informasi video dan format audio
        const info = await ytdl.getInfo(videoUrl, options);
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const audioUrl = audioFormats[0].url; // ambil url audio yang playable

        const result = {
          title: video.title,
          thumb: video.thumbnail,
          channel: video.author.name,
          published: video.ago,
          views: video.views,
          streamUrl: audioUrl // kembalikan url audio langsung yang playable
        };

        resolve(result);
      }).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
