// const fs = require('fs')
// const path = require('path')

// function writeFile(info) {
//   const fileName = path.resolve(__dirname, '../../db/', info.fileName + '-' + info.fileMD5)
//   if (fs.existsSync(fileName)) {
//     // console.log('file already exists!')
//     console.log(`[UTILS]: file already exists`);
//     return
//   }
//   return new Promise(function(resolve, reject) {
//     fs.writeFile(fileName, info.data, function(err) {
//     // if (err) throw err
//     if (err) {
//         console.log(`[ERROR]: ${err}`);
//         reject();
//     }
//     // console.log('write file Done!')
//     console.log(`[UTILS]: write file done`);
//     resolve()
//   })
//   })
// }

// module.exports = {
//   writeFile: writeFile
// }
