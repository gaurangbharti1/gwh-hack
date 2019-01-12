// https://cloud.google.com/docs/authentication/production#auth-cloud-implicit-nodejs

var exports = module.exports = {};
const spawn = require("child_process").spawn;
exports.transcription = async function(fileName) {
    let link = "gs://cryo-bucket/" + fileName
    console.log(link)
    let transcript = await getTranscript(link)
    // console.log("Transcript :")
    // console.log(transcript)
    let summary = await getSummary(transcript)
    console.log("Summary :")
    console.log(summary)
    let data = {
        transcript: transcript,
        summary: summary
    }
    return data
}
async function getTranscript(link) {
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');

    // Creates a client
    const client = new speech.SpeechClient();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const gcsUri = link;
    const encoding = 'LINEAR16';
    //const sampleRateHertz = 16000;
    const languageCode = 'en-US';

    const config = {
        encoding: encoding,
        //sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        enableAutomaticPunctuation: true
    };

    const audio = {
        uri: gcsUri,
    };

    const request = {
        config: config,
        audio: audio,
    };

    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    return client
        .longRunningRecognize(request)
        .then(data => {
            const operation = data[0];
            // Get a Promise representation of the final result of the job
            return operation.promise();
        })
        .then(data => {
            const response = data[0];
            // console.log(response.results)
            //console.log(response.results.alternatives[0].transcript)
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
            console.log(`Transcription: ${transcription}`);
            return transcription
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}
async function getSummary(transcript) {
    // var spawn = require('child-process-promise').spawn;

    // var promise = spawn('python3', ["/home/ubuntu/workspace/Summarizer.py", transcript]);

    // var childProcess = promise.childProcess;

    // console.log('[spawn] childProcess.pid: ', childProcess.pid);
    // childProcess.stdout.on('data', function(data) {
    //     console.log('[spawn] stdout: ', data.toString());
    // });
    // childProcess.stderr.on('data', function(data) {
    //     console.log('[spawn] stderr: ', data.toString());
    // });

    // var kappa = await promise.then(function() {
    //         console.log('[spawn] done!');
    //     })
    //     .catch(function(err) {
    //         console.error('[spawn] ERROR: ', err);
    //     });

    const util = require('util')

    const pythonProcess = spawn('python3', ["/home/ubuntu/workspace/Summarizer.py", transcript]);
    var summary;
    console.log("Python :")
    let temp = await pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        //summary = data
        // console.log(data)
        /*
                //console.log(summary)
              //  var StringDecoder = require('string_decoder').StringDecoder;

                var decoder = new StringDecoder('utf8');
                var textChunk = decoder.write(summary);
                // console.log("Text Chunk")
                // console.log(textChunk)

                summary = textChunk
                console.log(textChunk)
                const fs = require('fs');
                const fs_writeFile = util.promisify(fs.writeFile)
                  fs_writeFile("summary.json", summary, function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                }).then(function(){
                    return true
                })
                */
        if (data) {
            return true
        }
    });
    if (temp) {
        var fs = require('fs');
        const fs_readFile = util.promisify(fs.readFile);

        async function getStuff() {
            return await fs_readFile('summary.txt', 'utf8');
        }

        // Can't use `await` outside of an async function so you need to chain
        // with then()
        var obj = await getStuff().then(data => {
            return data
        });
        return obj;
        //

    }

}

exports.summary = async function(transcript) {
    //  console.log(transcript)
    let summary = await getSummary(transcript)
    console.log("Summary :")
    console.log(summary)
    return summary
}
