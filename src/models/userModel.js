const url = 'mongodb://localhost:27017';
// const url = 'mongodb://222.20.79.250:27017';
const MongoClient = require('mongodb').MongoClient;

function getUserInfo (username) {
    return new Promise ( function (resolve, reject) {
        MongoClient.connect (url, { useNewUrlParser: true }, function (err, db) {
            // if(err) throw err;
            if (err) {
                console.error(`[ERROR]: ${err}`);
                reject();
            }

            const dbase = db.db('cancer-classifier');
            const findObj = { 'username': username};

            dbase.collection('user').find(findObj).toArray( function (err,result) {
                // if( err ) throw err;
                if (err) {
                    console.error(`[ERROR]: ${err}`);
                    reject();
                }

                db.close();
                resolve(result);
            })
        })
    })
}

function updateUserInfo (whereStr, updateObj) {
    return new Promise ( function (resolve, reject) {
        MongoClient.connect (url, { useNewUrlParser: true}, function (err, db) {
            // if (err) throw err;
            if (err) {
                console.error(`[ERROR]: ${err}`);
                reject();
            }
    
            const dbase = db.db('cancer-classifier');
            const updateStr = {$set: updateObj};
    
            dbase.collection('user').updateOne(whereStr, updateStr, function (err, res) {
                // if(err) throw err;
                if (err) {
                    console.error(`[ERROR]: ${err}`);
                    reject();
                }
                db.close();
                resolve('success');
            })
        })
    })
}

function addUser (info) {
    MongoClient.connect ( url, { useNewUrlParser: true}, function(err, db) {
        // if(err) throw err;
        if (err) {
            console.error(`[ERROR]: ${err}`);
        }
        const dbase = db.db('cancer-classifier');
        dbase.collection('user').insertOne (info, function (err, res){
            // if(err) throw err;
            if (err) {
                console.error(`[ERROR]: ${err}`);
            }
            db.close();
        })
    })
}
module.exports = {
    addUser,
    getUserInfo,
    updateUserInfo
}