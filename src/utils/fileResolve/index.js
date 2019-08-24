const fs = require ('fs');
const path = require ('path');
const resolveVCF = require('./handleVCF');
const getHugoSVM = require('./fieldExtraction').getHugoSVM;

async function resolveFile (info) {
    const data = info.data;
    let isVCF = false, isMAF = false;
    const vcfPattern = /fileformat\=vcf/i;
    const mafPattern = /hugo_symbol(.*)radialsvm_rankscore/i;
    if (vcfPattern.exec(data) != null) {
        isVCF = true;
        // return {
        //     code: '000000',
        //     data: null,
        //     msg: 'vcf format not supported'
        // };
    } else if (mafPattern.exec(data) != null) {
        isMAF = true;
    } else {
        return {
            code: '000000',
            data: null,
            msg: 'unsupported file format'
        };
    }
    if (isMAF) {
        getHugoSVM(info);
    } else if (isVCF) {
        resolveVCF.convertToOncotator(info);
        await resolveVCF.runOncotator(info);
        resolveVCF.getHugoSVMFromOncotator(info);
    }
}

module.exports = {
    resolveFile
}