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

      const audioStream = await playdl.stream(video.url);

      const result = {
        title: video.title,
        thumb: video.thumbnail,
        channel: video.author.name,
        published: video.ago,
        views: video.views,
        streamUrl: audioStream.stream, // Stream audio
        type: audioStream.type // 'opus' atau 'mp3'
      };

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = playMusic;
