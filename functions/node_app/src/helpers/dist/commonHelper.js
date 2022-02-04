var fs = require('fs');
exports.prepareUploadFolder = function (path) {
    var pathExist = fs.existsSync(path);
    if (!pathExist) {
        fs.mkdirSync(path, {
            recursive: true
        });
    }
};
