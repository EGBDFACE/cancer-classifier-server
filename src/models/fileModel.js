const fs = require('fs')
const path = require('path')

function writeFile(info) {
  const fileName = path.resolve(__dirname, '../../db/', info.fileName + '-' + info.fileMD5)
  if (fs.existsSync(fileName)) {
    console.log('file already exists!')
    return
  }
  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, info.data, function(err) {
    if (err) throw err
    console.log('write file Done!')
    resolve()
  })
  })
}

module.exports = {
  writeFile: writeFile
}
