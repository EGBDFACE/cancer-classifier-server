const controller = require('../controllers');

let fn_signIn = async (ctx, next) => {
    let username = ctx.request.body.username,
        password = ctx.request.body.password;

    console.log(`[sign in] name: ${username} password: ${password}`);

    await controller.userSignIn(ctx);
};

let fn_getSalt = async (ctx, next) => {
    let username = ctx.request.body.username;

    console.log(`[get salt] name: ${username}`);

    await controller.userGetSalt(ctx);
}

module.exports = [
    {
        method: 'POST',
        path: '/api/signIn',
        func: fn_signIn
    },
    {
        method: 'POST',
        path: '/api/getSalt',
        func: fn_getSalt
    }
]