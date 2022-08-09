## Assignment tasks completed

### 1. Built a single API that serves all file and segment metadata when given a “fileId” as an input parameter (/file/presentation/:fileId).

There are 3 scenarios catered in this api process:

- First it will check if the file data is already polled into our system if so just get from DB and return.
- If our DB hit misses, or we say the file data is not polled yet (lets think our service just started and our task/scheduler is not reached yet to the desired file) then it will get file from file/all api.
- After getting file from file/all api if the file processing status is FINISHED it will store in DB and returns.
- If file processing status is other than FINISHED just throw an error from there no need to process.

### 2. Create a storage mechanism to reduce the HTTP overhead of making API calls / Include an ingestion procedure that will only save “FINISHED” files

- To reduce the overhead of HTTP calls middleware relational database (MySQL) is introduced which contains **denormalize data** in the file table. This table contains all FINISHED file details and segments together. This Db will mostly be populated by or scheduler which polls data.
- DB will only save FINISHED files
- As this table may gets huge we can use Sharding to handle that kind of scenario.

| Table            |                                                                                                                                                      
|------------------|
| fileId           |
| processingStatus |
| fileDetails      |
| fileSegments     |
| organizationId   |
| series           |



### 3. Build a polling procedure that will continually check files

- Written a schedular using generator which will run at every specified time (lets say every 10 mins) and, checks and save FINISHED files to our DB.

### 4. Design/Build an authentication scheme

- Implemented the JWT validation which will validates incoming requests.
- As we will be serving business client the logic revolves around api-secret-key which for just demo purpose i have put in the constant file otherwise it should not be there, for live we should maintain environment variables.

### 5. Mechanism to only show files that have been uploaded by the requestor’s organization (/file/presentationByOrganization).

- So to get started i assumed that there is an Organization table maintained already. We can ad organizationId as a foreign key in file Details.
- As specified from above structure table in our db have an organizationId field which will be queried to get the files related to that organization.
- We will get organization id from token instead of passing it as a param.

### 6.Add an endpoint to GET all files by “series (/file/presentationBySeries/:series)

- Added series field in db which will queried to get the files according to series. (Db structure provided above)

