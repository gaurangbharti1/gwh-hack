// https://cloud.google.com/nodejs/getting-started/using-cloud-storage

var fs = require('fs');
var ytdl = require('ytdl-core');
var path = require('path');
var readline = require('readline');
const ffmpeg = require('fluent-ffmpeg');

var exports = module.exports = {};
exports.newVideo = async function(req, res) {
    let url = req.body.url;
    if (await downloadAudio(url)) {
        res.status(200).json({
            output: 'success'
        })
    }

}
var convertMono = async function() {
    console.log("In Mono: ")
    var FfmpegCommand = require('fluent-ffmpeg');
    var command = new FfmpegCommand();
    var command = ffmpeg('./sample.wav').audioChannels(1);
    if (await uploadGs()) {
        return true
    }

}
var downloadAudio = async function(url) {

    //const url = 'https://www.youtube.com/watch?v=gxJ4M7tyLRE';

    if (!url) {
        console.log('yt-audio: error, no URL provided');
    }
    else {
        console.log('Getting video info...please wait.');
        ytdl.getInfo(url, function(err, info) {
            if (err) {
                console.log('Error while getting info');
                throw err;
            }
            console.log('Successfully downloaded video info, downloading audio now....');

            var title = 'sample';
            console.log('Video title: ' + title);

            var options = {
                filter: 'audioonly'
            };

            var output = path.resolve(__dirname, './' + title + '.mp3');

            var stream = ytdl(url, options);
            stream.pipe(fs.createWriteStream(output));
            var starttime;

            stream.once('response', function() {
                starttime = Date.now();
            });
            stream.on('progress', function(chunkLength, downloaded, total) {
                var floatDownloaded = downloaded / total;
                var downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
                readline.cursorTo(process.stdout, 0);
                process.stdout.write((floatDownloaded * 100).toFixed(2) + '% downloaded');
                process.stdout.write('(' + (downloaded / 1024 / 1024).toFixed(2) + 'MB of ' + (total / 1024 / 1024).toFixed(2) + 'MB)\n');
                process.stdout.write('running for: ' + downloadedMinutes.toFixed(2) + ' minutes');
                process.stdout.write(', estimated time left: ' + (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2) + ' minutes');
                readline.moveCursor(process.stdout, 0, -1);
            });
            stream.on('end', async function() {
                process.stdout.write('\n\n');
                let track = './sample.mp3'; //your path to source file
                ffmpeg(track)
                    .toFormat('wav')
                    .on('error', (err) => {
                        console.log('An error occurred: ' + err.message);
                    })
                    .on('progress', (progress) => {
                        // console.log(JSON.stringify(progress));
                        console.log('Processing: ' + progress.targetSize + ' KB converted');
                    })
                    .on('end', () => {
                        console.log('Processing finished !');

                    })
                    .save('./sample.wav'); //path where you want to save your file
                if (await convertMono()) {
                    return true
                }
            });
        });
    }

}

var uploadGs = async function() {
    console.log("In Gs: ")
    // Imports the Google Cloud client library
    const { Storage } = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const bucketName = 'cryo-bucket';
    const filename = './sample.wav';

    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);
    return true;
}
