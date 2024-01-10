const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())

// // ################################# ################################# MogoDB operations Start


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        // DB & Collections

        const database = client.db("ToDoDB");
        const TaskCollection = database.collection("Tasks");

        // APIs
        app.post("/api/v1/task", async (req, res) => {
            try {
                const newTask = req.body;

                const result = await haiku.insertOne(newTask);

                console.log(`A Task was inserted with the _id: ${result.insertedId}`);

                res.send(result);
            } catch (error) {
                console.log(error);
            }

        })





        client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// // ################################# ################################# MongoDB operations End

app.get('/', (req, res) => {
    res.send('ToDo Server is Running. cors init. Ready To Load API')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})