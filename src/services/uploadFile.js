const child_process = require('child_process')
const path = require('path')
const fs = require('fs')
const fileModel = require('../utils/fileModel');

async function getUploadFile(data) {
  await fileModel.writeFile(data)
  return 'OK'
}

async function getModelRes(data) {
  await runModel(data)
  return await getResult(data)
}

async function runModel(data) {
  await execRemoveHeader(data)
  await execToMatrix(data)
  await runClassifier(data)
}

function getResult(data) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-result.txt'), function(err, data) {
			// if (err) throw err
            if (err) {
				console.log(`[ERROR]: ${err}`);
				reject();
            }
			resolve(data)
		})
	})	
}

function execRemoveHeader(data) {
	return new Promise(function(resolve, reject) {
		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/', 'remove_header.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5)} ${path.resolve(__dirname, '../../db/' + data.fileName + '-' + data.fileMD5 + '-noheader')}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
			// if (error) throw error
            if (error) {
				console.log(`[ERROR]: ${error}`);
				reject();
            }
			// console.log(3)
			console.log(`[UTILS]: procedure 3`);
			resolve()
		})
	})    
}

function execToMatrix(data) {
	return new Promise(function(resolve, reject) {
		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/', 'to_matrix.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-noheader')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5)}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
			// if (error) throw error
            if (error) {
				console.log(`[ERROR]: ${error}`);
				reject();
            }
			// console.log(4)
			console.log(`[UTILS]: procedure 4`);
			resolve()
		})
	})
}

function runClassifier(data) {
	return new Promise(function(resolve, reject) {
		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/predict/', 'predict.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '.npy')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-result.txt')}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
			// if (error) throw error
            if (error) {
				console.log(`[ERROR]: ${error}`);
				reject();
            }
			// console.log('Run model Done!')
			console.log(`[UTILS]: Run model done`);
			resolve()
		})
	})
}

module.exports = {
  getUploadFile: getUploadFile,
  getModelRes: getModelRes 
}
