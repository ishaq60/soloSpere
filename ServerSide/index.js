const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 8000;

const app = express();

const corsOption = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,  // Corrected the typo from 'Credential' to 'credentials'
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());  // JSON parsing middleware, no need for a second call

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vu8ej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server (optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

// Define job and bids collections
const jobCollection = client.db('soloSpehere').collection('Jobs');
const bitCollection = client.db('soloSpehere').collection('bids');

//JWT Generate


// Define routes
app.get("/jobs", async (req, res) => {
  const result = await jobCollection.find().toArray();
  
  res.send(result);
});

app.get('/job/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };  // Correct query format

  try {
    const result = await jobCollection.findOne(query);  // Removed unnecessary `{ query }`
    if (!result) {
      return res.status(404).send({ message: "Job not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});
app.delete('/jobs/:id', async (req, res) => {
  const id = req.params.id;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid job ID format" });
  }

  const query = { _id: new ObjectId(id) };  // Correct query format

  try {
    const result = await jobCollection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Job not found" });
    }
    
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//save a bid data in database

app.post('/bit', async (req, res) => {
  try {
    const bitData = req.body; // Ensure body parsing middleware is used
    const result = await bitCollection.insertOne(bitData);
    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});
//Job added
app.post('/jobs', async (req, res) => {
  try {
    const JobData = req.body; // Ensure body parsing middleware is used
    const result = await jobCollection.insertOne(JobData);
    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

//get all job posted by specific user

// app.get('/jobs/:email', async (req, res) => {
//   const email = req.params.email;

//   try {
//     const query = { 'buyer.buyer_email': email }; // Correct query structure
//     const result = await jobCollection.find(query).toArray();
//     res.send(result);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).send({ message: "Server error" });
//   }
// });
app.get('/jobs/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const query = { 'buyer_email': email };
    const result = await jobCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Server error" });
  }
});


//git add bit 
app.get('/my-bids/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const query = { "email": email };
    const result = await bitCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Server error" });
  }
});

//Get all  bid request from db for job owner

app.get('/bids-request/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const query = {  'bayerEmail':email };
    const result = await bitCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Server error" });
  }
});
//updateStatus
app.patch('/bid/:id',async(req,res)=>{
  const id=req.params.id
  const {status}=req.body
  console.log(status);
 
  const query={_id:new ObjectId(id)};
  const updateDocs={
    $set:{status}
  };
  const result=await bitCollection.updateOne(query,updateDocs)
  res.send(result)
})


app.get('/', (req, res) => {
  res.send("Hello server is running");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
