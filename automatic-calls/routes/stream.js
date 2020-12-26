module.exports = function(req, res) {
    const config = require('.././config');

    const service = req.params.service + 'filepath';
    const fs = require('fs');

    if(!!config[service] && config[service] != undefined) {
        const filePath = config[service];
        var stat = fs.statSync(filePath);
        var total = stat.size;
        if (req.headers.range) {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
    
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total-1;
            var chunksize = (end-start)+1;
            var readStream = fs.createReadStream(filePath, {start: start, end: end});
            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
                'Content-Type': 'video/mp4'
            });
                readStream.pipe(res);
            } else {
                res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
                fs.createReadStream(filePath).pipe(res);
            }
    } else {
        res.send('Bad service.');
    }
};
