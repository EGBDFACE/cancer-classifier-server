const fs = require ('fs');
const path = require ('path');

function resolveFile (info) {
    const data = info.data;
    let isVCF = false, isMAF = false;
    const vcfPattern = /fileformat\=vcf/i;
    const mafPattern = /hugo_symbol(.*)radialsvm_rankscore/i;
    if (vcfPattern.exec(data) != null) {
        isVCF = true;
        return {
            code: '000000',
            data: null,
            msg: 'vcf format not supported'
        };
    } else if (mafPattern.exec(data) != null) {
        isMAF = true;
    } else {
        return {
            code: '000000',
            data: null,
            msg: 'unsupported file format'
        };
    }
    const dArr = data.split('\n');
    if (isMAF) {
        let hugoSymbolIndex , svmScoreIndex;
        let resultStr = 'Hugo_Symbol' + '\t' + 'i_dbNSFP_RadialSVM_rankscore' + '\n';
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
        const pathName = path.resolve(__dirname,'../../assets/uploadFile/',info.fileName+'-'+info.fileMD5);
        fs.writeFile(pathName,resultStr,(err) => {
            if (err) {
                console.error(`[ERROR]: file write wrong, the msg is ${err}`);
            }
        })
    } 
}

module.exports = {
    resolveFile
}