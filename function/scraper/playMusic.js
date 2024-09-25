const yts = require('yt-search');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');

const playMusic = async (input) => {
  try {
    if (!input) {
      throw new Error('Input not specified');
    }

    let videoInfo;
    let searchResult;
    let isSearch = false;

    if (input.startsWith('https://www.youtube.com/') || input.startsWith('https://youtu.be/')) {
      videoInfo = await ytdl.getInfo(input);
      searchResult = await yts({ videoId: videoInfo.videoDetails.videoId });
    } else {
      const searchResults = await yts(input);
      if (!searchResults.videos.length) {
        throw new Error('No videos found for the search query');
      }
      searchResult = searchResults.videos[0];
      videoInfo = await ytdl.getInfo(searchResult.url);
      isSearch = true;
    }

    // Mendapatkan URL audio dan video langsung dari ytdl-core
    const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
    const videoFormats = ytdl.filterFormats(videoInfo.formats, 'videoonly');

    const audioURL = audioFormats.length ? audioFormats[0].url : "-";
    const videoURL = videoFormats.length ? videoFormats[0].url : "-";

    // Menggunakan tinyurl untuk memperpendek URL, jika diperlukan
    const shortAudioURL = audioURL !== "-" ? await (await fetch(`https://tinyurl.com/api-create.php?url=${audioURL}`)).text() : "-";
    const shortVideoURL = videoURL !== "-" ? await (await fetch(`https://tinyurl.com/api-create.php?url=${videoURL}`)).text() : "-";

    return {
      resultado: {
        channelUrl: searchResult.author.url || "-",
        views: searchResult.views || "-",
        category: "-",
        id: videoInfo.videoDetails.videoId || searchResult.videoId || "-",
        url: searchResult.url || "-",
        publicDate: searchResult.ago || "-",
        uploadDate: searchResult.ago || "-",
        keywords: videoInfo.videoDetails.keywords ? videoInfo.videoDetails.keywords.join(", ") : "-",
        title: videoInfo.videoDetails.title || searchResult.title || "-",
        channel: searchResult.author.name || "-",
        seconds: searchResult.duration.seconds || "-",
        description: videoInfo.videoDetails.shortDescription || searchResult.description || "-",
        image: videoInfo.videoDetails.thumbnails[0].url || searchResult.thumbnail || "-",
        download: {
          audio: isSearch ? shortAudioURL : audioURL,
          video: isSearch ? shortVideoURL : videoURL,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = playMusic;
