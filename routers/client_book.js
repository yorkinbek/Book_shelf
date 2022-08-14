const express = require('express')

const router = express.Router()

let dataBase = require('./../dataBase/data.js')

router.post('/client_book/:cid/:bid', (req, res) => {
    let client_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)
    let data = dataBase.readData()

    // validations
    if (!client_id) {
        res.status(400).send("client_id is required");
        return
    }

    if (!book_id) {
        res.status(400).send("book_id is required");
        return
    }

    // for checking id client returned book before
    for (let i = 0; i < data.ClientAndBooks.length; i++) {
        const element = data.ClientAndBooks[i];
        if (!element.returned_day == "") {
            res.status(400).send(`client id:${client_id} you already has tokken book but haven't returned yet:!`);
            return
        }
    }

    data.ClientAndBooks.push({
        client_id: client_id,
        book_id: book_id,
        joined_at: new Date()
    })
    dataBase.writeData(data)
    res.status(201).send("successfully created")
})

router.delete('/client_book/:cid/:bid', (req, res) => {
    let client_id = parseInt(req.params.cid)
    let book_id = parseInt(req.params.bid)
    let data = dataBase.readData()
    if (!client_id) {
        res.status(400).send("client_id is required");
        return
    }

    if (!book_id) {
        res.status(400).send("book_id is required");
        return
    }

    let clientsAndBook = data.ClientAndBooks.find(e => e.client_id == client_id && e.book_id == book_id)
    if (!clientsAndBook) {
        res.status(400).send(`:${client_id} client_id doesn't have the :${book_id} book_id!`);
        return
    }

    data.ClientAndBooks = data.ClientAndBooks.filter(e => e.client_id != client_id || e.book_id != book_id)
    dataBase.writeData(data)
    res.status(200).send("successfully deleted")
})

const clientRouter = require('./client')
const bookRouter = require('./book')

router.get('/client_book/:cid', (req, res) => {
    let client_id = parseInt(req.params.cid)
    let data = dataBase.readData()
    let client = data.clients.find(e => e.id == client_id)

    if (!client) {
        res.status(400).send("client_id is required");
        return
    }

    let clientBookList = data.ClientAndBooks.filter(e => e.client_id == client.id)
    if (!clientBookList.length) {
        res.status(400).send(`client_id:${client_id} doesn't have books`);
        return
    }

    clientBookList.forEach(e => {
        for (let i = 0; i < data.books.length; i++) {
            if (e.book_id == data.books[i].id) {
                e.book = data.books[i]
                break
            }
        }

    });

    res.json({ books: clientBookList, client: client })
})

module.exports = router