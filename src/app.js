const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const Koa = require('koa');
const koajwt = require('koa-jwt');
const route = require('./route');

const app = new Koa();

// corss-domain
app.use(cors({ origin: '*'}));

// use bodyparse
app.use(bodyParser({
	jsonLimit: '50mb',
	formLimit: '50mb'
}));

// token验证失败会抛出401错误,需要错误处理.
// app.use((ctx,next) => {
//   return next().catch( (err) => {

//     if(err.status === 401){
//        ctx.status = 401;
//        ctx.body = {
//           code: '000002',
//           data: null,
//           msg: 'Protected resource, use Authorization header to get access\n'
//        };
//     }else{
//       throw err;
//     }
//   })
// });

// // token
// app.use(koajwt({
//   secret: 'cancer-classifier'
// }).unless({
//   // path: [/\/api\/signIn/, /\/api\/getSalt/]
//   path: [/\/api\/uploadFile/,/\/api\/getResult/]
// }))

// use route 
app.use(route());

 app.listen(9090,'222.20.79.250',()=>{
   console.log('port is running on http://222.20.79.250:9090');
   });
//app.listen(9090,'172.31.46.224', () => {
//  console.log('port is running on http://172.31.46.224:9090');
//})
