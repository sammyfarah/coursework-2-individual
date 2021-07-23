const express = require ('express');
const app = express ();

const mongoClient = require('mongodb').MongoClient
let db;

//connect mongodb to mongodb compass
mongoClient.connect('mongodb+srv://samera:farah@cluster0.tlcth.mongodb.net/'
, (err, client) => {
db = client.db('webstore')
})
 
app.param('collectionName'
, (req, res, next, collectionName) => {
req.collection = db.collection(collectionName)
return next()
})

//collection name
app.get('/'
, (req, res, next) => {res.send('Select a collection, e.g., /collection/CollectionName')
})


app.get('/collection/:collectionName'
, (req, res, next) => {
req.collection.find({}, {limit: 5, sort: [['price'
         , +1]]})
    .toArray((e, results) => {
         if (e) return next(e)
       res.send(results) }) })

app.post('/collection/:collectionName'
, (req, res, next) => {
req.collection.insert(req.body, (e, results) => {
if (e) return next(e)
res.send(results.ops)}) })


const ObjectID = require('mongodb').ObjectId;
app.get('/collection/:collectionName/:id',(req,res,next) => {
req.collection.findone(
      {_id: new ObjectID(req.params.id) },
                (e, result) => {
           if (e) return next(e)
              res.send(result) }) })




app.put('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.update(
{ _id: new ObjectID(req.params.id) },
{ $set: req.body },
{ safe: true, multi: false },
(e, result) => {
if (e) return next(e)
res.send((result.result.n === 1) ?
{msg: 'success'} : { msg: 'error'})
})
})


app.delete('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.deleteOne(
{ _id: ObjectID(req.params.id) },
(e, result) => {
if (e) return next(e)
res.send((result.result.n === 1) ?
{msg: 'success'} : {msg: 'error'})
})
})

app.listen(3000, ()=> {
console.log('express is working on server localhost:3000')})




