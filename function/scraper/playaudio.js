const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');

async function playaudio(query) {
    return new Promise(async (resolve, reject) => {
        try {
            // mencari video berdasarkan query
            const searchResults = await yts(query);
            const videos = searchResults.videos;

            if (videos.length === 0) {
                return reject(new Error('Video tidak ditemukan'));
            }

            // mendapatkan URL video pertama dari hasil pencarian
            const videoUrl = videos[0].url;

            // mengambil info video
            const videoInfo = await ytdl.getInfo(videoUrl);

            // mendapatkan format audio (audio/webm; codecs="opus")
            const audioFormats = videoInfo.formats.filter(format => format.mimeType === 'audio/webm; codecs="opus"');
            if (audioFormats.length === 0) {
                return reject(new Error('Format audio tidak ditemukan'));
            }

            // ambil URL audio
            const audioUrl = audioFormats[0].url;

            // informasi lainnya
            const result = {
                title: videoInfo.videoDetails.title,
                thumb: videoInfo.videoDetails.thumbnails[0].url,
                channel: videoInfo.videoDetails.author.name,
                published: videoInfo.videoDetails.publishDate,
                views: videoInfo.videoDetails.viewCount,
                url: audioUrl
            };

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = playaudio;
