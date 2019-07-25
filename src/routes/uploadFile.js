const controller = require('../controllers');

// var fn_pullChunkList = async (ctx, next) => {
//   let fileMd5 = ctx.request.body.fileMd5,
//       chunksNumber = ctx.request.body.chunksNumber;
  
//   console.log(`[pullChunkList] fileMd5: ${fileMd5} chunksNumber: ${chunksNumber}`);
  
//   await controller.getPullListRes(ctx);
// };

// var fn_uploadChunkFile = async (ctx, next) => {
//   let fileMd5 = ctx.request.body.fileMd5,
//       chunkMd5 = ctx.request.body.chunkMd5,
//       chunkData = ctx.request.body.chunkData,
//       chunkNumber = ctx.request.body.chunkNumber,
//       chunksNumber = ctx.request.body.chunksNumber;
  
//   console.log(`[uploadChunkFile] chunkMd5: ${chunkMd5} chunkNumber/chunksNumber: ${chunkNumber}/${chunksNumber}`);

//   await controller.getChunkRes(ctx);
// };

var fn_uploadFile = async (ctx, next) => {
  let content = ctx.request.body;
  await controller.getUploadFileRes(ctx);
}

var fn_getResult = async (ctx, next) => {
  let content = ctx.request.body;
  await controller.getModelRes(ctx)
}

module.exports = [
  // {
  //   method: 'POST',
  //   path: '/api/pullChunkList',
  //   func: fn_pullChunkList
  // },
  // {
  //   method: 'POST',
  //   path: '/api/uploadChunkFile',
  //   func: fn_uploadChunkFile
  // },
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
