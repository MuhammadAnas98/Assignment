const {default: axios} = require("axios");
const {FETCH_ALL_FILES, FILE_ALL_API_LIMIT, FINISHED, PROCESSING} = require("../constants");
const logger = require("loglevel");
const helper = require("../sql-helper");
const { saveFileIfDbMisses } = require("../controllers/get-file-and-segment-metadata")

const fileProcessingTask = async () => {
    for await (const file of filesGenerator()){
        if(file.processingStatus === FINISHED)
        {
            const result = await helper.geFileByFileIdAndStatus(file.fileId, FINISHED);
            if (!result) {
                saveFileIfDbMisses(file);
            }
        }
    }
}

async function* filesGenerator() {
    let offset = 0;

    while (true) {
        const result = await axios.get(FETCH_ALL_FILES + (offset * FILE_ALL_API_LIMIT));
        offset++;

        if (!result.data.length) {
            return;
        }
        for (const file of result.data) {
            yield file;
        }
    }
}

module.exports = fileProcessingTask;
