const yts = require('yt-search');
const { ytmp3v2, ytmp4 } = require('ruhend-scraper');

// Fungsi untuk mencari video dan mengambil data audio & video
const playMusic = async (input) => {
  try {
    // Cari video di YouTube
    const searchResults = await yts(input);
    if (!searchResults.videos.length) {
      throw new Error('Tidak ada video yang ditemukan');
    }
    const searchResult = searchResults.videos[0]; // Ambil video pertama dari hasil pencarian
    const videoURL = searchResult.url;

    // Ambil data audio dan video menggunakan ruhend-scraper
    const audioData = await ytmp3v2(videoURL);
    const videoData = await ytmp4(videoURL);

    // Kembalikan hasil sesuai format dari ruhend-scraper
    return {
      ytmp3v2: {
        title: audioData.title || searchResult.title,
        audio: audioData.audio,
      },
      ytmp4: {
        title: videoData.title || searchResult.title,
        video: videoData.video,
        quality: videoData.quality,
        thumbnail: videoData.thumbnail,
        size: videoData.size,
      }
    };
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    throw error;
  }
};

module.exports = playMusic;
