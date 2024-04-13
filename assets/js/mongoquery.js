//const { MongoClient, ServerApiVersion } = require('../../node_modules/mongodb')
//import {MongoClient} from "../../node_modules/mongodb/"
//const { MongoClient, ServerApiVersion } = require('mongodb');
//import { MongoClient } from 'mongodb'
const {MongoClient, ServerApiVersion} = require('mongodb')
const uri = "mongodb+srv://maxchiu:sknJnYKshItW0420@cluster0.ibgdshl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


async function query() {
    try{
        const query = {howMany: {$ne: null}};
        //const limit = {projection: {_id: 0, howMany: 1}};
        const sample = samples.find(query, limit);
        await sample.forEach(console.dir); 
    }
    finally {
        await client.close();
    }
}
query().catch(console.dir);