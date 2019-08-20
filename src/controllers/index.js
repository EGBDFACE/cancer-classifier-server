// const getUploadFileService = require('../services/uploadFile').getUploadFile;
// const getModelResService = require('../services/uploadFile').getModelRes;
const uploadFileService = require('../services/uploadFile');
const userService = require('../services/userService');

const getUploadFileRes = async function(ctx) {
  const body = ctx.request.body;
  const info = {
    fileName: body.fileName,
    fileMD5: body.fileMD5,
    data: body.data
  };

  // ctx.body = await getUploadFileService(info)
  ctx.body = await uploadFileService.getUploadFile(info);
}

const getModelRes = async function(ctx) {
  const body = ctx.request.body;
  const info = {
    fileName: body.fileName,
    fileMD5: body.fileMD5
  };

  ctx.body = await uploadFileService.getModelRes(info);
  // ctx.body = await getModelResService(info)
}

const userSignIn = async function (ctx) {
  const body = ctx.request.body;
  const data = {username: body.username, password: body.password};

  ctx.body = await userService.signIn(data);
}

const userGetSalt = async function (ctx) {
  const username = ctx.request.body.username;

  ctx.body = await userService.getSalt(username);
}

module.exports = {
  getUploadFileRes,
  getModelRes,
  userSignIn,
  userGetSalt
};
