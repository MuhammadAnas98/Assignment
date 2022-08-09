const axios = require('axios').default;
const logger = require('loglevel');
const helper = require('../sql-helper');
const {
    FILE_ALL_API_LIMIT,
    FINISHED,
    FETCH_ALL_FILES,
    FETCH_FILE_SEGMENTS,
    FETCH_FILE_DETAILS,
} = require("../constants");

async function getFileAndSegmentMetadata(req) {
    const fileId = req.params.fileId;

    const result = await helper.geFileByFileIdAndStatus(fileId, FINISHED);

    if (result) {
        return {
            fileDetails: JSON.parse(result.fileDetails),
            fileSegments: JSON.parse(result.fileSegments),
        };
    }
    const file = await fileToCheckIfNotPolled(fileId);

    if (file?.processingStatus !== FINISHED) {
        logger.error(`Processing of the file with id: ${fileId} is not finished yet.`)
        throw new Error('Requested file processing is not finished yet.');
    }

   return await saveFileIfDbMisses(file);
}

async function saveFileIfDbMisses(file){

    const fileDetails = await getFileDetails(file.fileId);
    const fileSegments = await getFileSegments(file.fileId);

    let data = {};
    data.fileDetails = fileDetails || {};
    data.fileSegments = fileSegments || {};

    helper.insertFile({file, fileDetails, fileSegments});

    return data;
}

async function getFileDetails(fileId) {
    try {
        const result = await axios.get(FETCH_FILE_DETAILS + fileId);
        return result.data;
    } catch (e) {
        logger.error('error encountered while fetching file details', e);
    }
}

async function getFileSegments(fileId) {
    try {
        const result = await axios.get(FETCH_FILE_SEGMENTS + fileId);
        return result.data;
    } catch (e) {
        logger.error('error encountered while fetching file segments', e);
    }
}

async function fileToCheckIfNotPolled(fileId) {
    let offset = 0;
    while (true) {
        try {
            const result = await axios.get(FETCH_ALL_FILES + (offset * FILE_ALL_API_LIMIT));
            offset++;

            if (!result.data.length) {
                return;
            }

            for (const file of result.data) {
                if (file.fileId === fileId) {
                    return file;
                }
            }
        } catch (error) {
            logger.error('error encountered while fetching file', e);
        }
    }
}

module.exports = {
    getFileAndSegmentMetadata,
    saveFileIfDbMisses
};