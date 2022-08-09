const express = require("express");
const { getFileAndSegmentMetadata } = require("./controllers/get-file-and-segment-metadata");
const getFileByOrganization = require("./controllers/get-file-by-organization-id");
const getFileBySeries = require("./controllers/get-file-by-series");

const {generateAccessToken, validateToken} = require("./jwt-helper");

let router = express();

router.get("/file/presentation/:fileId", async (request, response) => {
    validateToken(request, response);
    const data = await getFileAndSegmentMetadata(request, response)
        .catch(error =>  {
            console.error(error);
            response.json(error.message);
        });
    response.status(200).json(data);
});

router.get("/file/presentationBySeries/:series", async (request, response) => {
    validateToken(request, response);
    const data = await getFileBySeries(request, response)
        .catch(error =>  {
            console.error(error);
            response.json(error.message);
        });
    response.status(200).json(data);
});

router.get("/file/presentationByOrganization", async (request, response) => {
    validateToken(request, response);
    const data = await getFileByOrganization(request, response)
        .catch(error =>  {
            console.error(error);
            response.json(error.message);
        });
    response.status(200).json(data);
});

// this API is just for DEMO purpose to test token thingy
router.get("/generateToken", async (reqgit,res) => {
    const accessToken = generateAccessToken()
    res.json({accessToken: accessToken});
});

module.exports = router;

