const express = require('express')

const router = express.Router()

let dataBase = require('./../dataBase/data.js')

router.post('/', (req, res) => {
    let body = req.body
    // validations
    if (!body.id) {
        res.status(400).send("id field is required");
        return
    }
    if (!body.isbn) {
        res.status(400).send("isbn field is required");
        return
    }
    if (!body.title) {
        res.status(400).send("title field is required");
        return
    }
    if (!body.gener) {
        res.status(400).send("gener field is required");
        return
    }
    if (!body.description) {
        res.status(400).send("description field is required");
        return
    }
    if (!body.author) {
        res.status(400).send("author field is required");
        return
    }
    if (!body.publish_year) {
        res.status(400).send("publish_year field is required");
        return
    }
    if (!body.cover_photo_url) {
        res.status(400).send("cover_photo_url field is required");
        return
    }
    if (!body.publish_year) {
        res.status(400).send("pblish_year field is required");
        return
    }
    // to check if id already registered
    for (let i = 0; i < dataBase.readData().books.length; i++) {
        const element = dataBase.readData().books[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} title exists`);
            return
        }
    }

    body.created_at = new Date()

    let data = dataBase.readData()
    data.books.push(body)
    dataBase.writeData(data) // write again element to json file
    
    res.status(201).send("successfully created")
})

router.get('/', (req, res) => {
    let search = req.query.search // to find elements by ?search=

    if (!search) {
        search = ""
    }
    // to check if books title is inside of books
    let list = dataBase.readData().books.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))

    if (list.length == 0) {
        res.status(404).send("title not found!")
        return
    }

    res.json(list)
})

// get element by id
router.get('/:id', (req, res) => {
    let id = req.params.id

    let book = dataBase.readData().books.find(e => e.id == id)
    if (!book) {
        res.status(400).send(`id:${id} title doesn't exist`);
        return
    }

    res.status(200).json(book)
})

router.put('/', (req, res) => {
    let body = req.body
    let data = dataBase.readData()
    let book = data.books.find(e => e.id == body.id)

    if (!book) {
        res.status(400).send(`id:${body.id} title doesn't exist!`);
        return
    }

    for (let i = 0; i < data.books.length; i++) {
        const element = data.books[i];
        if (element.id == body.id) {
            body.created_at = data.books[i].created_at
            body.updated_at = new Date()
            data.books[i] = body
            break;
        }
    }
    body.updated_at = new Date()

    dataBase.writeData(data)  // write again element to json file
    res.status(200).send("successfully updated")
})

router.delete('/:id', (req, res) => {
    let id = req.params.id // for searching by id
    let data = dataBase.readData()
    let book = dataBase.readData().books.find(e => e.id == id)
    if (!book) {
        res.status(400).send(`id:${id} title doesn't exist!`);
        return
    }
    
    data.books = data.books.filter(e => e.id != id) // to check id 
    dataBase.writeData(data) // write again element to json file
    res.status(200).send("successfully deleted")
})

module.exports = {router}
