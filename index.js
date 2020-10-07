require('dotenv').config();
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema');

const PORT = process.env.SERVER_PORT;

const app = express();

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));


app.get("/", (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => {
    console.log("Server is running at " + PORT);
    console.log("Dependent service: " + process.env.DEV_API_URL);
});