const url = 'mongodb://localhost:27017';
const MongoClient = require('mongodb').MongoClient;

function getFileItem (fileMd5) {
    return new Promise ( function (resolve, reject) {
        MongoClient.connect (url, {useNewUrlParser: true}, function (err, db) {
            if (err) {
                console.error(`[ERROR]: ${err}`);
                reject();
            }

            const dbase = db.db('cancer-classifier');
            const findObj = { 'fileMd5' : fileMd5} ;

            dbase.collection('file').find(findObj).toArray ( function (err, result) {
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

function addFile (item) {
    MongoClient.connect (url, { useNewUrlParser: true }, function (err,db) {
        if (err) {
            console.error(`[ERROR]: ${err}`);
        }

        const dbase = db.db('cancer-classifier');
        dbase.collection('file').insertOne(item, function (err,res) {
            if (err) {
                console.error(`[ERROR]: ${err}`);
            }
            db.close();
        })
    })
}

function updateFileItem (whereStr, updateObj) {
    return new Promise ( function (resolve, reject) {
        MongoClient.connect (url, {useNewUrlParser: true}, function (err,db) {
            if (err) {
                console.error(`[ERROR]: ${err}`);
                reject();
            }

            const dbase = db.db('cancer-classifier');
            const updateStr = {$set: updateObj};

            dbase.collection('file').updateOne(whereStr, updateStr, function(err,res) {
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

module.exports = {
    addFile,
    getFileItem,
    updateFileItem
}