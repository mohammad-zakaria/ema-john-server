const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.8hqot.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json())
app.use(cors())


const port = 5000

console.log(process.env.DB_User)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  app.post('/addProduct',(req,res)=>{
      const products = req.body;
    //   console.log(products)
      productsCollection.insertMany(products)
      .then(result => {
          console.log(result.insertedCount)
          res.send(result.insertedCount)
      })

  })


  app.get('/products',(req,res) =>{
      productsCollection.find({})
      .toArray((err, documents) =>{
          res.send(documents)
      })

  })

  app.get('/product/:key',(req,res) =>{
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) =>{
        res.send(documents[0])
      })

  })

  app.post('/productsByKeys',(req,res)=>{
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents)=>{
        res.send(documents)
      })
  })
    // perform actions on the collection object
    //   client.close();
    console.log('database connected')
});


app.listen(process.env.PORT || port)