const fs = require('fs');
const path = require('path');

function getHugoSVM(info) {
    let hugoSymbolIndex, svmScoreIndex;
    let resultStr = 'Hugo_Symbol' + '\t' + 'i_dbNSFP_RadialSVM_rankscore' + '\n';
    const dArr = info.data.split('\n');
    const mafPattern = /hugo_symbol(.*)radialsvm_rankscore/i;
    for (let i=0; i<dArr.length; i++) {
        if (dArr[i].indexOf('#') == -1 && dArr[i].length != 0) {
            if (mafPattern.exec(dArr[i]) != null) {
                const colArr = dArr[i].split('\t');
                const hugoReg = /\S*hugo_symbol\S*/i;
                const svmReg = /\S*radialsvm_rankscore\S*/i;
                const hugoName = hugoReg.exec(dArr[i])[0];
                const svmName = svmReg.exec(dArr[i])[0];
                hugoSymbolIndex = colArr.indexOf(hugoName);
                svmScoreIndex = colArr.indexOf(svmName);
            } else if(hugoSymbolIndex != undefined && svmScoreIndex != undefined){
                const lineArr = dArr[i].split('\t');
                resultStr += lineArr[hugoSymbolIndex] + '\t' + lineArr[svmScoreIndex] + '\n';
            } else {
                console.log(`[ERROR]: file resolve, can't find index`);
            }
        }
    }
    const pathName = path.resolve(__dirname, '../../assets/uploadFile/', `${info.fileName}-${info.fileMD5}`);
    // try {
    //     fs.writeFileSync(pathName,resultStr);
    // } catch (err) {
    //     console.error(`[ERROR]: get hugo and svm then write file wrong, detail: ${err}`);
    // }
    fs.writeFile(pathName,resultStr,function(err){
        if(err) {
            console.error(`[ERROR]: get hugo and svm then write file wrong, detail: ${err}`);
        }
    });
}

module.exports = {
    getHugoSVM
}