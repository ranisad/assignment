const express = require('express');
const app = express();
const path = require('path');
var multiparty = require('multiparty');
var fs = require('fs');
const readline = require('readline');

global.__base = __dirname;

app.get('/', (req, res) => {
    res.sendFile(path.join(`${__base}/home.html`));
})

app.post('/upload', (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, (err, fields, file) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(file['uploadedFile'][0].path)
        });
        var outputFileName = `${new Date()}.txt`

        var logger = fs.createWriteStream(outputFileName, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })

        rl.on('line', function (line) {
            var isAttacked = false;
            var tempArr = line.split(' ');
            
            if (tempArr.length > 17) {
                isAttacked = true;
            } else if (tempArr[3] == '"MATLAB R2013a"') {
                isAttacked = true;
            }

            logger.write(`${isAttacked ? 'Yes' : 'No'} ${line}\n`);
        });

        rl.on('close', () => {
            res.download(outputFileName)
        });
    });
})

// Handle 404
app.use((req, res) => {
    res.status(404).json('404: Page not Found');
});

// Handle 500
app.use((error, req, res, next) => {
    res.status(500).json('500: Internal Server Error' + error);
    next();
});

app.listen(3000, function () {
    console.log('application running on port 3000');
});