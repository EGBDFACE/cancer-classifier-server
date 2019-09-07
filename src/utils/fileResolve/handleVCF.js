const fs = require('fs');
const path = require('path');

const getHugoSVMFromOncotator = require('./oncotator').getHugoSVMFromOncotator;
const oncotatorInputFiledCheck = require('./oncotator').oncotatorInputFieldCheck;
const runOncotator = require('./oncotator').runOncotator;

function convertToOncotator(info) {
    let result = 'chr' + '\t' + 'start' + '\t' + 'end' + '\t' + 'ref_allele' + '\t'+ 'alt_allele' + '\n';
    const value = info.data;
    const dArr = value.split('\n');
    let startToWriteStr = false;
    const headPattern = /#chrom\s+pos\s+id\s+ref\s+alt\s+/i;
    const itemStartPattern = /^[(\d+)(x)(y)]/i;
    for (let i=0; i<dArr.length; i++) {
        if (startToWriteStr && itemStartPattern.exec(dArr[i]) != null) {
            const colArr = dArr[i].trim().split('\t');
            const START = colArr[1]; // pos
            const ALT_ARR = colArr[4].split(','); // alt array
            const CHROM = colArr[0]; // chrom
            const REF = colArr[3];  // ref
            let END = START; // start
            for (let j=0; j<ALT_ARR.length; j++) {
                if (REF.length >= ALT_ARR[j].length) {
                    if (oncotatorInputFiledCheck(CHROM,START,END,REF,ALT_ARR[j])) {
                        result += `chr${CHROM}\t${START}\t${END}\t${REF}\t${ALT_ARR[j]}\n`;
                    }else {
                        console.log(`[FILE RESOLVE]: wrong item: ${CHROM}\t${START}\t${END}\t${REF}\t${ALT_ARR[j]}`);
                    }
                } else {
                    END = ALT_ARR[j].length - REF.length + parseInt(START);
                    if (oncotatorInputFiledCheck(CHROM,START,END,REF,ALT_ARR[j])) {
                        result += `chr${CHROM}\t${START}\t${END}\t${REF}\t${ALT_ARR[j]}\n`;
                    }else {
                        console.log(`[FILE RESOLVE]: wrong item: ${CHROM}\t${START}\t${END}\t${REF}\t${ALT_ARR[j]}`);
                    }
                }
            }
        } else if (headPattern.exec(dArr[i]) != null) {
            startToWriteStr = true;
        }
    }
    const pathName = path.resolve(__dirname, '../../assets/uploadFile/',`${info.fileName}-${info.fileMD5}-oncotator-input`);
    try{
        fs.writeFileSync(pathName,result);
    } catch(err) {
        console.error(`[ERROR]: converted vcf format write wrong, the msg is ${err}`);
    }
}

async function fileResolve (info) {
    convertToOncotator(info);
    await runOncotator(info);
    getHugoSVMFromOncotator(info);
}


module.exports = {
    fileResolve
}