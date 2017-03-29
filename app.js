GLOBAL.approot = __dirname;
var express = require("express"),
	path = require('path'),
	bodyParser = require('body-parser'),	
	fs = require('fs');
var uploadLimit = 838860800;	
app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.text({limit: uploadLimit}));
app.use(bodyParser.raw({limit: uploadLimit}));
app.use(bodyParser.json({limit: uploadLimit}));
app.use(bodyParser.urlencoded({extended: true, parameterLimit: uploadLimit,limit: uploadLimit}));

app.post('/uploadAudio', _uploadAudio);
function _uploadAudio(req, res) {
    var filename = req.body.filename,
            audiobuf = req.body.audiobuf,
            uploadPath = approot + '/public/ogg/';
    if (filename !== undefined && filename !== "" && audiobuf !== undefined && audiobuf !== "") {
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        fs.exists(uploadPath + filename, function (exists) {
            if (exists) {
                res.send("exist");
            } else {
                fs.writeFile(uploadPath + filename, new Buffer(audiobuf.toString("base64"), 'base64'), function (err) {
                    if (err) {
                        console.log(err);
                        res.send(null);
                    } else {
                        res.sendStatus(200);
                    }
                })
            }
        })
    } else {
        res.send("Insufficient Data");
    }
};

var server = app.listen(4444, function () {
    console.log("Listening on port %s...", server.address().port);
});
