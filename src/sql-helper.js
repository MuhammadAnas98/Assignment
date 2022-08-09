const { dbConnection } = require('./configs/mysql');

function insertFile ( {file, fileDetails, fileSegments, organizationId} ){
    const sql = "INSERT INTO file (fileId, processingStatus, fileDetails, fileSegments, organizationId, series) VALUES (?)";
    const values = [
        file.fileId,
        file.processingStatus,
        JSON.stringify(fileDetails),
        JSON.stringify(fileSegments),
        organizationId,
        fileDetails?.seriesTitle,
    ]
    dbConnection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted ");
    });
}

function geFileByFileIdAndStatus (fileId, status ){
    const sql = "select fileDetails, fileSegments from file where fileId = ? AND processingStatus = '"+ status +"'";

    return new Promise((resolve, reject) => {
        dbConnection.query(sql, [fileId], function (err, result) {
            if (err) throw err;
            resolve(result[0]);
        });
    });
}

function geFileByOrganizationId (orgId){
    const sql = "select fileDetails, fileSegments from file where organizationId = ?";

    return new Promise((resolve, reject) => {
        dbConnection.query(sql, [orgId], function (err, result) {
            if (err) throw err;
            resolve(result);
        });
    });
}

function geFileBySeries (series){
    const sql = "select fileDetails, fileSegments from file where series = ?";

    return new Promise((resolve, reject) => {
        dbConnection.query(sql, [series], function (err, result) {
            if (err) throw err;
            resolve(result);
        });
    });
}


module.exports = {
    insertFile,
    geFileByFileIdAndStatus,
    geFileBySeries,
    geFileByOrganizationId,
}

