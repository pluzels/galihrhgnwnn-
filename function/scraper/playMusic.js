const yts = require('yt-search');
const axios = require('axios');
const querystring = require('querystring');
const cheerio = require('cheerio');

// Fungsi untuk mengonversi video ke mp3
const ytmp33 = async (url) => {
  const parameters = {
    'url': url,
    'format': 'mp3',
    'lang': 'en'
  };

  try {
    const conversionResponse = await axios.post('https://s64.notube.net/recover_weight.php', querystring.stringify(parameters));
    if (!conversionResponse.data.token) {
      throw new Error('No token received.');
    }
    const token = conversionResponse.data.token;
    const downloadPageResponse = await axios.get('https://notube.net/en/download?token=' + token);

    if (downloadPageResponse.status !== 200) {
      throw new Error('Failed to retrieve download page.');
    }

    const $ = cheerio.load(downloadPageResponse.data);
    const result = {
      'title': $('#breadcrumbs-section h2').text(),
      'download': $('#breadcrumbs-section #downloadButton').attr('href')
    };

    return { status: true, result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

// Fungsi untuk mengonversi video ke mp4
const ytmp44 = async (url) => {
  const parameters = {
    'url': url,
    'format': 'mp4',
    'lang': 'en'
  };

  try {
    const conversionResponse = await axios.post('https://s64.notube.net/recover_weight.php', querystring.stringify(parameters));
    if (!conversionResponse.data.token) {
      throw new Error('No token received.');
    }
    const token = conversionResponse.data.token;
    const downloadPageResponse = await axios.get('https://notube.net/en/download?token=' + token);

    if (downloadPageResponse.status !== 200) {
      throw new Error('Failed to retrieve download page.');
    }

    const $ = cheerio.load(downloadPageResponse.data);
    const result = {
      'title': $('#breadcrumbs-section h2').text(),
      'download': $('#breadcrumbs-section #downloadButton').attr('href')
    };

    return { status: true, result };
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

    // Ambil data audio dan video
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
