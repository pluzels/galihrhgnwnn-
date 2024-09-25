const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

const playMusic = async (input) => {
  try {
    if (!input) {
      throw new Error('Input not specified');
    }

    let videoInfo;
    let searchResult;

    // Memeriksa apakah input adalah URL YouTube
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (youtubeUrlRegex.test(input)) {
      // Jika input adalah URL YouTube, proses URL tersebut
      videoInfo = await ytdl.getInfo(input);
    } else {
      // Jika input bukan URL, lakukan pencarian dengan yt-search
      const searchResults = await yts(input);
      if (!searchResults.videos.length) {
        throw new Error('No videos found for the search query');
      }
      searchResult = searchResults.videos[0];
      videoInfo = await ytdl.getInfo(searchResult.url);
    }

    // Mendapatkan link download audio dan video
    const audioStream = ytdl.downloadFromInfo(videoInfo, { quality: 'highestaudio' });
    const videoStream = ytdl.downloadFromInfo(videoInfo, { quality: 'lowestvideo' });

    // Menggunakan judul video untuk nama file, bersihkan nama dari karakter tidak valid
    const fileNameBase = videoInfo.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
    const audioFileName = `${fileNameBase}.mp3`;
    const videoFileName = `${fileNameBase}.mp4`;

    const audioFilePath = path.join(__dirname, 'downloads', audioFileName);
    const videoFilePath = path.join(__dirname, 'downloads', videoFileName);

    // Download dan simpan audio ke file lokal
    await new Promise((resolve, reject) => {
      const audioWriteStream = fs.createWriteStream(audioFilePath);
      audioStream.pipe(audioWriteStream);
      audioStream.on('end', resolve);
      audioStream.on('error', reject);
    });

    // Download dan simpan video ke file lokal
    await new Promise((resolve, reject) => {
      const videoWriteStream = fs.createWriteStream(videoFilePath);
      videoStream.pipe(videoWriteStream);
      videoStream.on('end', resolve);
      videoStream.on('error', reject);
    });

    // Buat URL atau path untuk akses file
    const audioUrl = `http://localhost/downloads/${audioFileName}`;
    const videoUrl = `http://localhost/downloads/${videoFileName}`;

    // Setelah file didownload dan dijadikan link, atur mekanisme untuk menghapus file setelah diakses
    setTimeout(() => {
      fs.unlink(audioFilePath, (err) => {
        if (err) console.error('Error deleting audio file:', err);
      });
      fs.unlink(videoFilePath, (err) => {
        if (err) console.error('Error deleting video file:', err);
      });
    }, 60000); // File akan dihapus setelah 60 detik

    // Mengembalikan hasil dengan link download audio dan video
    return {
      resultado: {
        title: videoInfo.videoDetails.title || "-",
        download: {
          audio: audioUrl,
          video: videoUrl,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = playMusic;
