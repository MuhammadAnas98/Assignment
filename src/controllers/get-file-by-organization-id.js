const helper = require('../sql-helper');
const logger = require("loglevel");

async function getFileByOrganization(req) {
    const orgId = req.organizationId;

    let result = await helper.geFileByOrganizationId(orgId);

    if(!result){
        logger.error(`Either this organization has no files or the process  is not finished yet`);
    }

    result = result.map(file => {
        return {
            fileDetails: JSON.parse(file.fileDetails),
            fileSegments: JSON.parse(file.fileSegments)
        }
    });
    return result;
}

module.exports = getFileByOrganization;