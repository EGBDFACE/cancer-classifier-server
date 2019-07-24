const getUploadFileService = require('../services/uploadFile').getUploadFile;
const getModelResService = require('../services/uploadFile').getModelRes;

const getUploadFileRes = async function(ctx) {
  const body = ctx.request.body
  const info = {
    fileName: body.fileName,
    fileMD5: body.fileMD5,
    data: body.data
  }
  ctx.body = await getUploadFileService(info)
}

const getModelRes = async function(ctx) {
  const body = ctx.request.body;
  const info = {
    fileName: body.fileName,
    fileMD5: body.fileMD5
  }
  ctx.body = await getModelResService(info)
}

module.exports = {
  getUploadFileRes: getUploadFileRes,
  getModelRes: getModelRes
};
