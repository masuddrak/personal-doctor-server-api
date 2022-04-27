const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const query = require('express/lib/middleware/query');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json())
// connect api


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yfy06.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const serviceCollectin = client.db('doctor').collection('sevice')
        app.get('/sevice', async (req, res) => {
            const query = {}
            const cursor = serviceCollectin.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/sevice/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const sevice=await serviceCollectin.findOne(query)
            res.send(sevice)
        })
        // post add user
        app.post('/sevice', async(req,res)=>{
            const newService=req.body;
            const result=await serviceCollectin.insertOne(newService)
            res.send(result)
        })
        // delete one item
        app.delete("/sevice/:id",async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result = await serviceCollectin.deleteOne(query);
            res.send(result)
        })
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('runing persona doctors profile')
})
app.listen(port, () => {
    console.log('Listening top prot', port)
})