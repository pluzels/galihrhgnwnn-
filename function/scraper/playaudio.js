const youtubedl = require('youtubedl-core');
const yts = require('yt-search');

async function playaudio(query) {
  return new Promise((resolve, reject) => {
    yts(query)
      .then(data => {
        const url = data.all.filter(video => video.type === 'video')[0]?.url;
        if (!url) {
          return reject(new Error('Video URL not found'));
        }

        const options = {
          quality: 'highest',
          filter: 'audioonly' // Menambah filter untuk audio saja
        };

        youtubedl.getInfo(url, options)
          .then(info => {
            const audioFormat = info.formats.find(format => format.ext === 'webm' && format.acodec === 'opus'); // Cari ext sesuai codec
            if (!audioFormat) {
              return reject(new Error('Audio format not found'));
            }

            const result = {
              title: info.title,
              thumb: info.thumbnail,
              channel: info.uploader,
              published: info.upload_date,
              views: info.view_count,
              url: audioFormat.url
            };

            resolve(result);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = playaudio;
