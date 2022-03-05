const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


// 
app.use(cors());
app.use(express.json());
require('dotenv').config();



// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogqtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// 
async function run() {
    try {
        console.log('from function')
        await client.connect();
        const database = client.db("nyx");
        const booksCollaction = database.collection('books');
        // // GET API
        app.get('/books', async (req, res) => {
            const cursor = booksCollaction.find({});
            const books = await cursor.toArray();
            res.send(books)
})



        // // GET A SINGEL API
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            console.log('specific id', id)
            const query = { _id: ObjectId(id) };
            const book = await booksCollaction.findOne(query);
            res.json(book);   
        })
        
   
        // // POST API
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await booksCollaction.insertOne(book)
            res.json(result)
        })
 

        //UPDATE API
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBook = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: updatedBook.name,
                    writer: updatedBook.writer,
                    hints: updatedBook.hints,
                    img: updatedBook.img,
                    price: updatedBook.price,
                },
            };
            const result = await booksCollaction.updateOne(filter, updateDoc)
            console.log('updating', id)
            res.json(result)
        })




        // //DELETE API
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id, 'hited')
            const result = await booksCollaction.deleteOne(query)
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




// 
app.get('/', (req, res) => {
    console.log('connected from get')
    res.send('Hello World! from nyx')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})