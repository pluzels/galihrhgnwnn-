const fs = require('fs');
const path = require('path');
const { youtubedl, youtubedlv2 } = require('@bochilteam/scraper-youtube');

const playMusic = async (input) => {
  try {
    if (!input) {
      throw new Error('Input not specified');
    }

    let videoInfo;
    if (input.startsWith('https://www.youtube.com/') || input.startsWith('https://youtu.be/')) {
      // Jika input adalah URL YouTube
      try {
        videoInfo = await youtubedl(input);
      } catch (error) {
        videoInfo = await youtubedlv2(input);
      }
    } else {
      throw new Error('Invalid URL');
    }

    // Mendapatkan link download audio dan video
    const audioStream = videoInfo.audio['128kbps']?.download();
    const videoStream = videoInfo.video['360p']?.download();
    
    // Menggunakan judul video untuk nama file, bersihkan nama dari karakter tidak valid
    const fileNameBase = videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
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
        title: videoInfo.title || "-",
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
