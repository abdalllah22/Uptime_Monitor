## Uptime Monitor

The main idea of the app is to build an uptime monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, outages, and total uptime/downtime.
### Prerequisites:

- The application was built using Node.js, express.js Framework, so you should ensure you have installed it on your machine.

### <a name="Features">Features</a>
- Sign-up with email verification.
- Stateless authentication using JWT.
- Users can create a check to monitor a given URL if it is up or down.
- Users can edit, or delete their checks if needed.
- Users should receive email alerts whenever a check goes down or up.
- Users can get detailed uptime reports about their checks availability, average response time, and total uptime/downtime.

### <a name="toc">Technologies</a>

- [Back-End](#back-end)
  - [Node.js](#NodeJS)
  - [express.js](#express.js)
- [Database](#Database)
  - [MongoDb](#MongoDb)
- [api-docs](#api-docs)
  -[swagger](#swagger)

