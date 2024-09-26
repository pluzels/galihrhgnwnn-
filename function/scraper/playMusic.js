const yts = require('yt-search');
const { yta, ytv } = require('@bochilteam/scraper-youtube'); // Import fungsi yta untuk audio dan ytv untuk video

// Fungsi untuk mengonversi video ke mp3 menggunakan @bochilteam/scraper-youtube
const ytmp33 = async (url) => {
  try {
    const { title, dl_link } = await yta(url); // Mengambil link download audio
    return {
      status: true,
      result: {
        title,
        download: dl_link
      }
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

// Fungsi untuk mengonversi video ke mp4 menggunakan @bochilteam/scraper-youtube
const ytmp44 = async (url) => {
  try {
    const { title, dl_link } = await ytv(url); // Mengambil link download video
    return {
      status: true,
      result: {
        title,
        download: dl_link
      }
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

// Fungsi utama untuk mencari video dan mendownload audio/video
const playMusic = async (input) => {
  try {
    const searchResults = await yts(input);
    if (!searchResults.videos.length) {
      throw new Error('Tidak ada video yang ditemukan');
    }
    const searchResult = searchResults.videos[0]; // Ambil video pertama
    const videoURL = searchResult.url;

    // Ambil data audio dan video menggunakan scraper-youtube
    const audioData = await ytmp33(videoURL);
    const videoData = await ytmp44(videoURL);

    return {
      audio: audioData.status ? audioData.result : null,
      video: videoData.status ? videoData.result : null,
    };
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    throw error;
  }
};

module.exports = playMusic;
