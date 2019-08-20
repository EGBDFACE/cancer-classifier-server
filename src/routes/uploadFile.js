const controller = require('../controllers');


var fn_uploadFile = async (ctx, next) => {
  let content = ctx.request.body;
  await controller.getUploadFileRes(ctx);
}

var fn_getResult = async (ctx, next) => {
  let content = ctx.request.body;
  await controller.getModelRes(ctx)
}

module.exports = [
  {
    method: 'POST',
    path: '/api/uploadFile',
    func: fn_uploadFile
  },
  {
    method: 'POST',
    path: '/api/getResult',
    func: fn_getResult
  }
]
