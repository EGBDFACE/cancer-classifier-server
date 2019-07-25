const bcrypt = require('bcryptjs');
const jsSHA = require('jssha');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function signIn (info) {
    const result = await userModel.getUserInfo(info.username);
    
    const nowTime = Math.floor(new Date().getTime()/60000);

    const passwordWithSalt = bcrypt.hashSync(result[0].password, result[0].salt);

    const shaObj = new jsSHA('SHA-512','TEXT');
    shaObj.update(passwordWithSalt);
    shaObj.update(nowTime.toString());
    const password = shaObj.getHash('HEX');

    const shaObjBefore = new jsSHA('SHA-512','TEXT');
    shaObjBefore.update(passwordWithSalt);
    shaObjBefore.update((nowTime-1).toString());
    const passwordBefore = shaObjBefore.getHash('HEX');

    const shaObjAfter = new jsSHA('SHA-512','TEXT');
    shaObjAfter.update(passwordWithSalt);
    shaObjBefore.update((nowTime+1).toString());
    const passwordAfter = shaObjAfter.getHash('HEX');

    if ( (info.password === password) || 
         (info.password === passwordBefore) || 
         (info.password === passwordAfter) ) {

            const token = jwt.sign({
                name: info.username,
                _id: result[0]._id
            }, 'cancer-classifier', { expiresIn: '2h'} );

            return {
                code: '000001',
                data: token,
                msg: 'success'
            };
    }else{
        return {
            code: '000002',
            data: null,
            msg: 'wrong username or password'
        };
    }
}

async function getSalt ( username ) {
    const result = await userModel.getUserInfo(username);
    
    if(result.length == 0){
        // userModel.addUser({'username': username});
        return {
            code: '000002',
            data: null,
            msg: 'no such user'
        };
    }else if (result[0].salt) {
        return {
            code: '000001',
            data: result[0].salt,
            msg: 'success'
        }
    }else {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const findObj = {username: username};
        const updateSaltObj = {"salt": salt};
        const status = await userModel.updateUserInfo(findObj,updateSaltObj);

        if(status === 'success'){
            return {
                code: '000001',
                data: salt,
                msg: 'success'
            }
        }else {
            return {
                code: '000003',
                data: null,
                msg: 'update db failed'
            }
        }
    }
}

module.exports = {
    getSalt,
    signIn
}