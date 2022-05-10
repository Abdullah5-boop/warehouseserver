const express = require('express')
const mongodb = require("mongodb")
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require("cors")
app.use(cors())
require('dotenv').config()
app.use(express.json())
const port = process.env.port || 5000;

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.q4ve3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const productcollection = client.db("WareHouse").collection("product")
        const OrderDetails = client.db("WareHouse").collection("OrderList")
        app.get("/Service", async (req, res) => {
            const querry = {};
            const cursor = productcollection.find(querry)
            const products = await cursor.toArray();
            // console.log(products)
            res.send(products)

        })
        app.get("/update/:_id", async (req, res) => {
            const id = req.params._id;
            const querry = { _id: ObjectId(id) }
            const product = await productcollection.findOne(querry)
            res.send(product)

        })
        app.delete('/update/:_id', async (req, res) => {
            const id = req.params._id;
            const querry = { _id: ObjectId(id) };
            const result = await productcollection.deleteOne(querry)
            res.send(result)
        })


        app.get('/order/:email', async (req, res) => {
            const email = req.params.email
            console.log("This is order/email", email)
            const querry = { user: email }
            const result = await OrderDetails.findOne(querry)
            console.log(result)
            res.send(result)

        })



        app.put("/update/:_id", async (req, res) => {
            const id = req.params._id;
            const updatedata = req.body;
            console.log(updatedata)
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    Carmake: updatedata.carName,
                    img: updatedata.img,
                    quantity: updatedata.Quantity
                }
            }
            const result = await productcollection.updateOne(filter, updateDoc, option)
            res.send(result)
        })
        app.put("/profile", async (req, res) => {
            const order = req.body.orders;
            const user = req.body.user;
            // console.log(user, order)
            const filter = { user: user }
            const option = { upsert: true }
            const updatedoc = {
                $set: {
                    user: user,
                    order: order

                }
            }
            const result = await OrderDetails.updateOne(filter, updatedoc, option)
            res.send(result)

        })

        app.put('/manage', async (req, res) => {
            const { _id, quantity, Carmake, img } = req.body;
            console.log(_id, " ", quantity, " ", Carmake, img)
            const filter = { _id: ObjectId(_id) }
            // console.log(filter)
            const product = await productcollection.findOne(filter)
            const option = { upsert: true }
            // console.log(product)
            // const a=parseInt(product.quantity)
            // const b=a-1;


            const updatedoc = {
                $set: {
                    Carmake: Carmake,
                    img: img,
                    quantity: quantity
                }
            }
            const result = await productcollection.updateOne(filter, updatedoc, option)
            // console.log(result)
            res.send(result)
        })


    }
    finally { }
}
run().catch(console.dir)






app.get('/', (req, res) => {
    res.send("running server warehouse in heroku")
})

app.listen(port, () => {
    console.log("Assingment is runnig on ", port)
})