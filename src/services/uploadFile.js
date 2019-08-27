const exec = require('child_process').exec;
const fs = require('fs');
// const fileModel = require('../utils/fileModel');
const fileModel = require('../models/fileModel');
const fileUtils = require('../utils/fileResolve');
const path = require('path');

async function getUploadFile(data) {
  const result = await fileModel.getFileItem(data.fileMD5);

  if (result.length == 0) {
	  const item = {
		  fileMd5: data.fileMD5,
		  score: ''
	  };
	  const writeRes = await fileUtils.resolveFile(data);
	  if (writeRes) {
		  return writeRes;
	  } else {
		fileModel.addFile(item);
		return {
			code: '000001',
			data: null,
			msg: 'success'
		};
	  }
  } else {
	  return {
		  code: '000001',
		  data: null,
		  msg: 'file already exists'
	  };
  }
}

async function getModelRes(data) {
  const result = await fileModel.getFileItem(data.fileMD5);
  if (result.length ==0 ) {
	return {
		code: '000003',
		data: null,
		msg: 'the dbase does not have such a file , maybe the file is still in resolving, please wait a second'
	};
  } if (result[0].score) {
	  return {
		  code: '000001',
		  data: result[0].score,
		  msg: 'success'
	  };
  } else {
	  await runModel(data);

	  const score = await getResult(data);
	  const findObj = {fileMd5: data.fileMD5};
	  const updateObj = {score: score};

	  fileModel.updateFileItem (findObj, updateObj);

	  return {
		  code: '000001',
		  data: score,
		  msg: 'success'
	  }
  }
}

async function runModel(data) {
//   await execRemoveHeader(data)
  await execToMatrix(data)
  await runClassifier(data)
}

function getResult(data) {
	return new Promise(function(resolve, reject) {
		const resultPath = path.resolve(__dirname,'../assets/uploadFile/', data.fileName+'-'+data.fileMD5+'-result.txt');
		fs.readFile(resultPath, 'utf8' ,function(err, data) {
			// if (err) throw err
            if (err) {
				console.log(`[ERROR]: ${err}`);
				reject();
			}else {
				const dArr = data.trim().split('\n');
				let result = {};
				for (let i=0; i<dArr.length; i++) {
					let colArr = dArr[i].split(/\s+/);
					result[colArr[0]] = colArr[1];
				}
				resolve(result);
			}
		})
	})	
}

// function execRemoveHeader(data) {
// 	return new Promise(function(resolve, reject) {
// 		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/', 'remove_header.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5)} ${path.resolve(__dirname, '../../db/' + data.fileName + '-' + data.fileMD5 + '-noheader')}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
// 			// if (error) throw error
//             if (error) {
// 				console.log(`[ERROR]: ${error}`);
// 				reject();
//             }
// 			// console.log(3)
// 			console.log(`[UTILS]: procedure 3`);
// 			resolve()
// 		})
// 	})    
// }

function execToMatrix(data) {
	return new Promise(function(resolve, reject) {
		// const inputFilePath = path.resolve(__dirname, '../assets/fileUpload/', data.fileName+'-'+data.fileMD5);
		// const outputFilePath = path.resolve(__dirname, '../assets/fileUpload/', data.fileName+'-'+data.fileMD5+'-output');
		const inputFilePath = data.fileName + '-' + data.fileMD5;
		const outputFilePath = inputFilePath + '-output';
		const pythonPath = path.resolve(__dirname, '../../model/', 'to_matrix.py');
		const cmdPath = path.resolve(__dirname,'../assets/uploadFile/')+'/';
		const cmdStdoutErrPath = inputFilePath + '-tomatrix-log.txt';
		const cmdStr = `python3 ${pythonPath} ${inputFilePath} ${outputFilePath} > ${cmdStdoutErrPath} 2>&1`;

		exec(cmdStr, {cwd: cmdPath}, err => {
			if (err) {
				console.error(`[ERROR]: to matrix fail, detail: ${err}`);
				reject();
			} else {
				console.log(`[PROCEDURE]: to matrix success`)
				resolve();
			}
		});
		// const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/', 'to_matrix.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-noheader')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5)}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
		// 	// if (error) throw error
        //     if (error) {
		// 		console.log(`[ERROR]: ${error}`);
		// 		reject();
        //     }
		// 	// console.log(4)
		// 	console.log(`[UTILS]: procedure 4`);
		// 	resolve()
		// })
	})
}

function runClassifier(data) {
	return new Promise(function(resolve, reject) {
		const cmdPath = path.resolve(__dirname, '../assets/uploadFile/')+'/';
		const inputFilePath = data.fileName + '-' + data.fileMD5 + '-output.npy';
		const outputFilePath = data.fileName + '-' + data.fileMD5 + '-result.txt';
		const pythonPath = path.resolve(__dirname, '../../model/predict/', 'predict.py');
		const cmdStdoutErrPath = data.fileName + '-' + data.fileMD5 + '-classifier-log.txt';
		const cmdStr = `python3 ${pythonPath} ${inputFilePath} ${outputFilePath} > ${cmdStdoutErrPath} 2>&1`;

		exec(cmdStr, {cwd: cmdPath}, err => {
			if (err) {
				console.error(`[ERROR]: classifier fail, detail: ${err}`);
				reject();
			} else {
				console.log(`[PROCEDURE]: classifier success`);
				resolve();
			}	
		})
		// const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/predict/', 'predict.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '.npy')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-result.txt')}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
		// 	// if (error) throw error
        //     if (error) {
		// 		console.log(`[ERROR]: ${error}`);
		// 		reject();
        //     }
		// 	// console.log('Run model Done!')
		// 	console.log(`[UTILS]: Run model done`);
		// 	resolve()
		// })
	})
}

module.exports = {
  getUploadFile: getUploadFile,
  getModelRes: getModelRes 
}
