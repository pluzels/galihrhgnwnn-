const youtubedl = require('youtubedl-core');
const yts = require('youtube-yts');

async function playaudio(query) {
  return new Promise((resolve, reject) => {
    yts(query)
      .then(data => {
        // Ambil URL video dari hasil pencarian youtube-yts
        const video = data.videos[0]; // Ambil video pertama dari hasil pencarian
        if (!video) {
          return reject(new Error('Video not found'));
        }

        const url = video.url;

        const options = {
          quality: 'highest',
          filter: 'audioonly' // Hanya ambil audio
        };

        // Menggunakan youtubedl-core untuk mengambil info audio
        youtubedl.getInfo(url, options)
          .then(info => {
            const audioFormat = info.formats.find(format => format.ext === 'webm' && format.acodec === 'opus'); // Cari format audio
            if (!audioFormat) {
              return reject(new Error('Audio format not found'));
            }

            const result = {
              title: info.title,
              thumb: info.thumbnail,
              channel: info.uploader,
              published: info.upload_date,
              views: info.view_count,
              url: audioFormat.url // URL audio
            };

            resolve(result); // Kembalikan hasilnya
          })
          .catch(reject); // Tangani kesalahan jika ada
      })
      .catch(reject); // Tangani kesalahan pencarian
  });
}

module.exports = playaudio;
