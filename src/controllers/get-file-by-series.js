const helper = require('../sql-helper');
const logger = require("loglevel");

async function getFileBySeries(req) {
    const series = req.params.series;

    let result = await helper.geFileBySeries(series);

    if(!result){
        logger.error(`Either No file with series: ${series} is finished processing or present.`);
    }

    result = result.map(file => {
        return {
            fileDetails: JSON.parse(file.fileDetails),
            fileSegments: JSON.parse(file.fileSegments)
        }
    });
    return result;
}

module.exports = getFileBySeries;