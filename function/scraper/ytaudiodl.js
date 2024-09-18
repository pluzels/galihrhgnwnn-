const youtubedl = require('youtubedl-core');

async function ytaudiodl(link) {
  return new Promise((resolve, reject) => {
    const options = {
      quality: 'highest',
      filter: 'audioonly' // Hanya ambil audio
    };

    // Menggunakan youtubedl-core untuk mengambil info audio
    youtubedl.getInfo(link, options)
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
  });
}

module.exports = ytaudiodl;
