const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const getHugoSVM = require('./fieldExtraction').getHugoSVM;

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
                    result += `chr${CHROM}\t${START}\t${END}\t${REF}\t${ALT_ARR[j]}\n`;
                } else {
                    END = ALT_ARR[j].length - REF.length + parseInt(START);
                    result += `chr${CHROM}\t${START}\t${END}\t${REF}\t${ALT_ARR[j]}\n`;
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

function runOncotator(info) {
    const outputFilePath = `${info.fileName}-${info.fileMD5}-oncotator-output`;
    const inputFilePath = `${info.fileName}-${info.fileMD5}-oncotator-input`;
    const cmdStdoutErrorPath = `${info.fileName}-${info.fileMD5}-oncotator-log.txt`;
    const cmdStr = `oncotator -v --db-dir /mnt/data/jackchu/temp/oncotator_v1_ds_April052016 ${inputFilePath} ${outputFilePath} hg19 > ${cmdStdoutErrorPath} 2>&1 `;
    const cmdPath = path.resolve(__dirname,'../../assets/uploadFile') + '/';
    
    return new Promise( function (resolve, reject) {
        exec(cmdStr, {cwd: cmdPath} , err => {
            if (err) {
                console.error(`[ERROR]: oncotator fail,detail: ${err}`);
                reject();
            } else {
                console.log(`[PROCEDURE]: oncotator success`);
                resolve();
            }
        })
    });
}

function getHugoSVMFromOncotator(info) {
    const fileInputPath = path.resolve(__dirname,'../../assets/uploadFile/',`${info.fileName}-${info.fileMD5}-oncotator-output`);
    // fs.readFile(fileInputPath,'utf8',function(err,data) {
    //     if (err) {
    //         console.error(`[ERROR]: get oncotator output file data wrong, detail: ${err}`);
    //     } else {
    //         const obj = {
    //             fileMD5: info.fileMD5,
    //             fileName: info.fileName,
    //             data: data
    //         };
    //         getHugoSVM(obj);
    //     }
    // })
    let fileData;
    try {
        fileData = fs.readFileSync(fileInputPath, 'utf8')
    } catch (err) {
        console.error(`[ERROR]: fs read file wrong, detail: ${err}`);
    }
    const obj = {
        fileMD5: info.fileMD5,
        fileName: info.fileName,
        data: fileData
    };
    getHugoSVM(obj);
}

module.exports = {
    convertToOncotator,
    getHugoSVMFromOncotator,
    runOncotator
}