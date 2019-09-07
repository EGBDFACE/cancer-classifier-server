const fs = require ('fs');
const getHugoSVM = require('./fieldExtraction').getHugoSVM;
const mafNoScoreResolve = require('./handleMafNoSVM').fileResolve;
const resolveVCF = require('./handleVCF').fileResolve;

async function resolveFile (info) {
    const data = info.data;
    let isVCF = false, isMAF = false;
    const vcfPattern = /fileformat\=vcf/i;
    const mafPattern = /hugo_symbol/i;
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
        const hasSVMPattern = /hogo_symbol(.*)radialsvm_rankscore/i;
        if (hasSVMPattern.exec(data) != null) {
            getHugoSVM(info);
        } else {
            await mafNoScoreResolve(info);
        }
    } else if (isVCF) {
        await resolveVCF(info);
    }
}

module.exports = {
    resolveFile
}