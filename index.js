const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// req 
app.use(express.json());
// app.use(cors())
app.use(cors({
    origin: ["https://todo-amber-five-99.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// // ################################# ################################# MogoDB operations Start


const uri = process.env.URI;
// console.log(process.env.URI);

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
                // console.log(req.body);
                const newTask = req.body;

                console.log("\nnew Task\n");
                console.log(newTask);
                const result = await TaskCollection.insertOne(newTask);

                console.log(`A Task was inserted with the _id: ${result.insertedId}`);

                res.send(result);
            } catch (error) {
                // console.log(error);
            }

        })
        app.get("/api/v1/tasks", async (req, res) => {
            try {
                // console.log(req.body);
                // const newTask = req.body;

                // console.log("\nnew Task\n");
                // console.log(newTask);
                // TODO: SET filter

                const statusQuery = req.query.status;

                const query = { status: statusQuery };
                const options = {};
                const result = await TaskCollection.find(query, options).toArray();
                res.send(result);

            } catch (error) {
                // console.log(error);
            }

        })

        app.put("/api/v1/previousTask", async (req, res) => {
            try {
                const task = req.body;
                // console.log(req.params.id);
                // console.log(id);
                const filter = { _id: new ObjectId(task?._id) };
                // console.log(filter);
                /* Set the upsert option to insert a document if no documents match
                the filter */
                const options = { upsert: true };
                // Specify the update to set a value for the plot field
                // console.log(task?.status);
                let updateDoc = {};
                if (task?.status == "todo") {
                    updateDoc = {
                        $set: {
                            status: `Incomplete`
                        },
                    };
                }
                else if (task?.status == "Doing") {
                    updateDoc = {
                        $set: {
                            status: `todo`
                        },
                    };
                }
                else if (task?.status == "Under Review") {
                    updateDoc = {
                        $set: {
                            status: `Doing`
                        },
                    };
                }
                else if (task?.status == "Completed") {
                    updateDoc = {
                        $set: {
                            status: `Under Review`
                        },
                    };
                }
                else if (task?.status == "OverDated") {
                    updateDoc = {
                        $set: {
                            status: `Incomplete`
                        },
                    };
                }
                else if (task?.status == "Incomplete") {
                    updateDoc = {
                        $set: {
                            status: `OverDated`
                        },
                    };
                }
                else {
                    updateDoc = {
                        $set: {
                            status: `Incomplete`
                        },
                    };
                }
                // console.log(updateDoc);
                // Update the first document that matches the filter
                const result = await TaskCollection.updateOne(filter, updateDoc, options);
                res.send(result);
            } catch (error) {
                console.log(error)
                res.send(error)
            }
        })
        app.put("/api/v1/nextTask", async (req, res) => {
            try {
                const task = req.body;
                const filter = { _id: new ObjectId(task?._id) };
                /* Set the upsert option to insert a document if no documents match
                the filter */
                const options = { upsert: true };
                // Specify the update to set a value for the plot field
                let updateDoc = {};
                if (task?.status == "Incomplete") {
                    updateDoc = {
                        $set: {
                            status: `todo`
                        },
                    };
                    
                }
                else if (task?.status == "todo") {
                    updateDoc = {
                        $set: {
                            status: `Doing`
                        },
                    };
                    
                }
                else if (task?.status == "Doing") {
                    updateDoc = {
                        $set: {
                            status: `Under Review`
                        },
                    };
                    
                }
                else if (task?.status == "Under Review") {
                    updateDoc = {
                        $set: {
                            status: `Completed`
                        },
                    };
                    
                }
                else if (task?.status == "Completed") {
                    updateDoc = {
                        $set: {
                            status: `OverDated`
                        },
                    };
                    
                }
                else if (task?.status == "OverDated") {
                    updateDoc = {
                        $set: {
                            status: `Incomplete`
                        },
                    };
                    
                }
                // else {
                //     updateDoc = {
                //         $set: {
                //             status: `todo`
                //         },
                //     };
                // }
                // Update the first document that matches the filter
                const result = await TaskCollection.updateOne(filter, updateDoc, options);
                res.send(result);
            } catch (error) {
                console.log(error)
                res.send(error)
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