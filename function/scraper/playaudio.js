const youtubedl = require('youtubedl-core');
const yts = require('yt-search');

async function playaudio(query) {
  return new Promise((resolve, reject) => {
    try {
      yts(query)
        .then((data) => {
          const url = [];
          const pormat = data.all;
          for (let i = 0; i < pormat.length; i++) {
            if (pormat[i].type === 'video') {
              let dapet = pormat[i];
              url.push(dapet.url);
            }
          }
          const id = youtubedl.getVideoID(url[0]);
          youtubedl.exec(url[0], ['--format', 'bestaudio'], {}, (err, output) => {
            if (err) {
              return reject(err);
            }

            // Parse the output to find the audio URL
            const audio = output.find(line => line.startsWith('http'));
            if (!audio) {
              return reject(new Error('Audio URL not found'));
            }

            youtubedl.getInfo(url[0], (err, info) => {
              if (err) {
                return reject(err);
              }

              const title = info.title;
              const thumb = info.thumbnail;
              const channel = info.uploader;
              const views = info.view_count;
              const published = info.upload_date;

              const result = {
                title: title,
                thumb: thumb,
                channel: channel,
                published: published,
                views: views,
                url: audio
              };
              resolve(result);
            });
          });
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playaudio;
