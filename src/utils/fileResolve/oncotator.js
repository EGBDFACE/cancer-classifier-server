const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const getHugoSVM = require('./fieldExtraction').getHugoSVM;

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

function oncotatorInputFieldCheck(chrom,start,end,ref,alt) {
    if (!chrom || start == undefined || end == undefined || !ref || !alt) {
        return false;
    }
    if (parseInt(chrom) > 23 || parseInt(chrom) < 0) {
        if (parseInt(chrom) != parseInt(chrom)) {
            if (chrom != 'x' && chrom != 'y' && chrom != 'X' && chrom != 'Y') {
                return false;
            }
        } else {
            return false;
        }
    }
    if (parseInt(start) != parseInt(start) || parseInt(end) != parseInt(end)) {
        return false;
    }
    const alleleCheckPattern = /[^(A)(T)(C)(G)]/;
    if (ref != '-') {
        if (alleleCheckPattern.exec(ref) != null) {
            return false;
        }
    }
    if (alt != '-') {
        if (alleleCheckPattern.exec(alt) != null) {
            return false;
        }
    }
    return true;
}

module.exports = {
    getHugoSVMFromOncotator,
    oncotatorInputFieldCheck,
    runOncotator
}