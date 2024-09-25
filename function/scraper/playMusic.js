const yts = require('yt-search');
const fetch = require('node-fetch');
const axios = require('axios');

// Fungsi utama untuk mencari video dan mendownloadnya
const playMusic = async (input) => {
  try {
    if (!input) {
      throw new Error('Input tidak ditentukan');
    }

    let searchResult;

    // Jika input berupa URL, langsung ambil URL tersebut, jika tidak lakukan pencarian
    if (input.startsWith('https://www.youtube.com/') || input.startsWith('https://youtu.be/')) {
      searchResult = await yts({ videoId: input.split('v=')[1] || input.split('youtu.be/')[1] });
    } else {
      const searchResults = await yts(input);
      if (!searchResults.videos.length) {
        throw new Error('Tidak ada video yang ditemukan untuk kueri pencarian');
      }
      searchResult = searchResults.videos[0]; // Ambil video pertama dari hasil pencarian
    }

    // URL video YouTube yang ditemukan
    const videoURL = searchResult.url || "-";
    
    // Menggunakan server dari tomp3.icu atau proxy.ezmp3.cc untuk mendownload video/audio
    const serverResponse = await axios.post('https://proxy.ezmp3.cc/api/getServer', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const serverUrl = serverResponse.data.serverURL;
    
    // Melakukan konversi video menggunakan API convert
    const convertResponse = await axios.post(`${serverUrl}/api/convert`, {
      url: videoURL,
      quality: 128,
      trim: false,
      startT: 0,
      endT: 0,
      videoLength: 0,
      restricted: false,
      code: 0,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const convertData = convertResponse.data;

    // Jika proses konversi berhasil, kembalikan URL untuk mendownload file audio atau video
    const downloadParams = `platform=youtube&url=${encodeURIComponent(videoURL)}&title=${convertData.title || 'video'}&id=YgEl3OEU2DA&ext=mp4&note=720p&format=136`;
    const downloadHeaders = {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: 'https://ssyoutube.com.co/en111bv/',
    };

    // Mendapatkan URL download
    const downloadResponse = await fetch('https://ssyoutube.com.co/mates/en/convert?id=YgEl3OEU2DA', {
      method: 'POST',
      headers: downloadHeaders,
      body: downloadParams,
    });

    let downloadData;

    // Pastikan response tidak null atau kosong
    try {
      downloadData = await downloadResponse.json();
    } catch (error) {
      throw new Error('Gagal memproses respons download, data tidak valid atau null.');
    }

    // Pastikan properti downloadUrlX tersedia
    if (!downloadData || !downloadData.downloadUrlX) {
      throw new Error('URL download tidak ditemukan atau tidak tersedia.');
    }

    // Mengembalikan informasi lengkap tentang video dan URL untuk mendownload
    return {
      result: {
        title: convertData.title || searchResult.title || "-",
        videoUrl: videoURL,
        mp3: convertData.url || 'MP3 URL tidak ditemukan',
        mp4: downloadData.downloadUrlX || 'No download options found',
        channelUrl: searchResult.author.url || "-",
        views: searchResult.views || "-",
        id: searchResult.videoId || "-",
        publicDate: searchResult.ago || "-",
        duration: searchResult.duration.timestamp || "-",
        description: searchResult.description || "-",
        image: searchResult.thumbnail || "-",
      },
    };
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    throw error;
  }
};

module.exports = playMusic;
