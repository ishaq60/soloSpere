const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt=require ('jsonwebtoken')
require('dotenv').config();
const cookieParser=require('cookie-parser')
const port = process.env.PORT || 8000;

const app = express();

const corsOption = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,  // Corrected the typo from 'Credential' to 'credentials'
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
  // JSON parsing middleware, no need for a second call


//verify jwt middleware

const verifyToken=(req,res,next)=>{
  const token =req.cookies?.token
  if(!token) return res.status(401).send({message:'Unauthorized: No token provided'})

  if(token){
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,decoded)=>{
    if(error){
      return res.status({message:'Unbothered token'})
    }
    console.log(decoded)
    req.user=decoded
    next()
    })
 
  }

}


app.use(cookieParser())
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
app.post('/jwt', async (req, res) => {
  const email = req.body;
  const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '365d',
  });
  res.cookie('token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:process.env.NODE_ENV==='production'?'none':'strict'
  })
  res.send({success:true}) // Send the token in the response
});

//clear token on Logout

app.get('/logout',(req,res)=>{


  res.clearCookie('token',{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:process.env.NODE_ENV==='production'?'none':'strict',
    maxAge:0,
  })
.send({success:true})

})

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



//update a job Details

app.put('/job/:id',async(req,res)=>{
  const id=req.params.id

  const jobData=req.body
  console.log(id,jobData);
  const query={_id:new ObjectId(id)}
  const options={upsert:true}
  const updateDocs={
    $set:{
      ...jobData,
    }
   
  }
  const result=await jobCollection.updateOne(query,updateDocs,options)
  res.send(result)
})


//save a bid data in database

app.post('/bit', async (req, res) => {
  try {
    const bitData = req.body; // Ensure body parsing middleware is used
    //duplicate data find
    const query={
      email:bitData.email,
      jobId:bitData.jobId,
    }
    const alreadyApplied=await  bitCollection.findOne(query)
   if(alreadyApplied){
    return res.
    status(400)
    .send('You have Already placed a bid on this jobs')
   }
    const result = await bitCollection.insertOne(bitData);
    res.status(201).json({ message: "Data inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});
//Job added
app.post('/jobs',verifyToken, async (req, res) => {
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

//specific job find
app.get('/jobs/:email', verifyToken,async (req, res) => {

const tokenEmail=req.user.email
console.log('hi',  tokenEmail);

  const email = req.params.email;
  // if(tokenEmail !==email){
  //   return res.status(403).send({message:'Forbidden token'})
  // }
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
app.get('/my-bids/:email',verifyToken, async (req, res) => {
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

app.get('/bids-request/:email',verifyToken, async (req, res) => {
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

//Get all jobs data from db for pagination
app.get("/all-jobs", async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page) - 1;
 const filter = req.query.filter;
 const sort=req.query.sort
 const search=req.query.search
  console.log(filter,sort);
  let query = {
    job_title: { $regex: search, $options: "i" },
  };
  let option={}
  if(sort) option={sort:{deadline: sort==='asc'?1 :-1}}

  if (filter) query.category = filter 

  const result = await jobCollection.find(query,option).skip(page * size).limit(size).toArray();

  res.send(result);
});


//Get all jobs count from db
app.get("/jobs-count", async (req, res) => {
  const count = await jobCollection.countDocuments()
  
  res.send({count});
});






app.get('/', (req, res) => {
  res.send("Hello server is running");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
