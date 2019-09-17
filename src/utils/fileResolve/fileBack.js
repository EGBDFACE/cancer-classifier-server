const fs = require('fs');
const path = require('path');

function fileBack(info) {
    const pathName = path.resolve(__dirname,'../../assets/fileBack/',`${info.fileName}-${info.fileMd5}`);

    fs.writeFile(pathName,info.data,function(err) {
        if (err) {
            console.error(`[ERROR]: in file back. write file to fileback error`);
        }
    })
}

module.exports = {
    fileBack
}