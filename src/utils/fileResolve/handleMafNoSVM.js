const fs = require('fs');
const path = require('path');
const getHugoSVMFromOncotator = require('./oncotator').getHugoSVMFromOncotator;
const oncotatorInputFieldCheck = require('./oncotator').oncotatorInputFieldCheck;
const runOncotator = require('./oncotator').runOncotator;

function convertToOncotator(info) {
    let resultStr = `chr\tstart\tend\tref_allele\talt_allele\n`;
    const value = info.data;
    const dArr = value.split('\n');
    let startToWriteStr = false;
    const headPattern = /hugo_symbol/i;
    let chrIndex = -1, startIndex = -1, endIndex = -1, 
        refAlleleIndex = -1, altAlleleIndex = -1;
    const chrPattern = /chromosome/i, startPattern = /start_position/i,
        endPattern = /end_position/i, refPattern = /reference_allele/i,
        altPattern = /tumor_seq_allele2/i;
    for (let i=0; i<dArr.length; i++) {
        if (startToWriteStr){
            if (chrIndex != -1 && startIndex != -1 && endIndex != -1 
                && refAlleleIndex != -1 && altAlleleIndex != -1) {
                const colArr = dArr[i].trim().split('\t');
                const CHROM = colArr[chrIndex];
                const START = colArr[startIndex];
                const END = colArr[endIndex];
                const REF = colArr[refAlleleIndex];
                const ALT = colArr[altAlleleIndex];
                if (oncotatorInputFieldCheck(CHROM,START,END,REF,ALT)) {
                    resultStr += `chr${CHROM}\t${START}\t${END}\t${REF}\t${ALT}\n`;
                } else {
                    console.log(`[FILE RESOLVE]: wrong item: ${CHROM}\t${START}\t${END}\t${REF}\t${ALT}`);
                }
            } else {
                console.log(`[FILE RESOLVE]:can't find fields in the file ${info.fileName} md5 is ${info.fileMD5}`);
                return 'unsupported file';
            }
        }else if (headPattern.exec(dArr[i]) != null) {
            const colArr = dArr[i].trim().split('\t');
            for (let j=0; j<colArr.length; j++) {
                if (chrPattern.exec(colArr[j]) != null) {
                    chrIndex = j;
                } else if (startPattern.exec(colArr[j]) != null) {
                    startIndex = j;
                } else if (endPattern.exec(colArr[j]) != null) {
                    endIndex = j;
                } else if (refPattern.exec(colArr[j]) != null) {
                    refAlleleIndex = j;
                } else if (altPattern.exec(colArr[j]) != null) {
                    altAlleleIndex = j;
                }
            }
            startToWriteStr = true;
        }
    }
    const pathName = path.resolve(__dirname, '../../assets/uploadFile/',`${info.fileName}-${info.fileMD5}-oncotator-input`);
    try {
        fs.writeFileSync(pathName, resultStr);
    } catch (err) {
        console.error(`[ERROR]: convert no svm to oncotator file input write wrong ,the msg is ${err}`);
    }
}

async function fileResolve(info) {
    const value = convertToOncotator(info);
    if (value) {
        return value;
    }
    await runOncotator(info);
    getHugoSVMFromOncotator(info);
}

module.exports = {
    fileResolve
}