const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//Middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@reactportfolio.odulu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const portfolioCollection = client.db("ReactPortfolio").collection("Portfolio");
      const testimonialCollection = client.db("ReactPortfolio").collection("Testimonials");
      
      //Add a portfolio item
      app.post('/portfolio', async (req, res) => {
          const portfolio = req.body;
          const result = await portfolioCollection.insertOne(portfolio);
          res.send(result);
      })

      //Get all portfolio item
      app.get('/portfolio', async (req, res) =>{
          const query = req.query;
          const result = await portfolioCollection.find(query).toArray();
          res.send(result);
      })
      //Get a portfolio item
      app.get('/portfolio/:id', async (req, res) =>{
        const id = req.params;
          const filter = {_id:ObjectId(id)};
        const result = await portfolioCollection.findOne(filter);
        res.send(result);
    })

      //Update a portfolio item
      app.put('/portfolio/:id', async (req, res) =>{
          const id = req.params;
          const filter = {_id:ObjectId(id)};
          const updatedData = req.body;
          const options = { upsert: true };
          console.log(updatedData)
          const updatedPortfolio = {
              $set: {
                title: updatedData.title,
                image: updatedData.image,
                github: updatedData.github,
                liveDemo: updatedData.liveDemo,
              }
          }

          const result = await portfolioCollection.updateOne(filter, updatedPortfolio, options);
          res.send(result);
      })

      //Delete a portfolio item 
      app.delete('/portfolio/:id', async (req, res) =>{
          const id = req.params;
          const query = {_id:ObjectId(id)};
          const result = await portfolioCollection.deleteOne(query);
          res.send(result);
      })



      //Add a Testimonial 
      app.post('/testimonials', async (req, res) => {
        const testimonial = req.body;
        const result = await testimonialCollection.insertOne(testimonial);
        res.send(result);
    })

    //Get all Testimonials 
    app.get('/testimonials', async (req, res) =>{
        const query = req.query;
        const result = await testimonialCollection.find(query).toArray();
        res.send(result);
    })
    //Get a Testimonial 
    app.get('/testimonials/:id', async (req, res) =>{
      const id = req.params;
        const filter = {_id:ObjectId(id)};
      const result = await testimonialCollection.findOne(filter);
      res.send(result);
  })

    //Update a Testimonial 
    app.put('/testimonials/:id', async (req, res) =>{
        const id = req.params;
        const filter = {_id:ObjectId(id)};
        const updatedData = req.body;
        const options = { upsert: true };
        console.log(updatedData)
        const updatedTestimonial = {
            $set: {
              title: updatedData.title,
              image: updatedData.image,
              github: updatedData.github,
              liveDemo: updatedData.liveDemo,
            }
        }

        const result = await testimonialCollection.updateOne(filter, updatedTestimonial, options);
        res.send(result);
    })

    //Delete a Testimonial
    app.delete('/testimonials/:id', async (req, res) =>{
        const id = req.params;
        const query = {_id:ObjectId(id)};
        const result = await testimonialCollection.deleteOne(query);
        res.send(result);
    })
    } 
    
    finally {
      
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Server is running.");
})

app.listen(port, () =>{
    console.log("Server running.");
})