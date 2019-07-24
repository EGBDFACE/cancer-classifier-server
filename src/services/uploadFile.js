const child_process = require('child_process')
const path = require('path')
const fs = require('fs')
const fileModel = require('../models/fileModel');

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
			if (err) throw err
			resolve(data)
		})
	})	
}

function execRemoveHeader(data) {
	return new Promise(function(resolve, reject) {
		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/', 'remove_header.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5)} ${path.resolve(__dirname, '../../db/' + data.fileName + '-' + data.fileMD5 + '-noheader')}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
			if (error) throw error
			console.log(3)
			resolve()
		})
	})    
}

function execToMatrix(data) {
	return new Promise(function(resolve, reject) {
		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/', 'to_matrix.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-noheader')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5)}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
			if (error) throw error
			console.log(4)
			resolve()
		})
	})
}

function runClassifier(data) {
	return new Promise(function(resolve, reject) {
		const process = child_process.exec(`python3 ${path.resolve(__dirname, '../../model/predict/', 'predict.py')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '.npy')} ${path.resolve(__dirname, '../../db/', data.fileName + '-' + data.fileMD5 + '-result.txt')}`, {maxBuffer: 50000 * 1024}, function(error, stdout, stderr) {
			if (error) throw error
			console.log('Run model Done!')
			resolve()
		})
	})
}

module.exports = {
  getUploadFile: getUploadFile,
  getModelRes: getModelRes 
}