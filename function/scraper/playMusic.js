const yts = require('yt-search');
const ruhend = require('ruhend-scraper');

// Fungsi utama untuk mencari video dan mendownloadnya
const playMusic = async (input) => {
  try {
    if (!input) {
      throw new Error('Input tidak ditentukan');
    }

    let searchResult;

    if (input.startsWith('https://www.youtube.com/') || input.startsWith('https://youtu.be/')) {
      searchResult = await yts({ videoId: input.split('v=')[1] || input.split('youtu.be/')[1] });
    } else {
      const searchResults = await yts(input);
      if (!searchResults.videos.length) {
        throw new Error('Tidak ada video yang ditemukan');
      }
      searchResult = searchResults.videos[0];
    }

    const videoURL = searchResult.url || "-";
    const mediaData = await ruhend.ytmp3(videoURL);

    if (!mediaData || !mediaData.url) {
      throw new Error('URL download tidak ditemukan.');
    }

    return {
      result: {
        title: searchResult.title || "-",
        videoUrl: videoURL,
        mp3: mediaData.url || 'MP3 URL tidak ditemukan',
        mp4: mediaData.mp4 || 'MP4 URL tidak ditemukan',
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
