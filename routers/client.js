
const express = require('express')

const router = express.Router()

let dataBase = require('./../dataBase/data.js')



router.post('/', (req, res) => {
    let body = req.body
    let data = dataBase.readData()  // reading json file
    // validations
    if (!body.id) {
        res.status(400).send("id field is required");
        return
    }

    if (!body.firstname) {
        res.status(400).send("firstname field is required");
        return
    }


    if (!body.lastname) {
        res.status(400).send("lastName field is required");
        return
    }

    if (!body.phone) {
        res.status(400).send("phone field is required");
        return
    }

    if (!body.date_of_birth) {
        res.status(400).send("birth day field is required");
        return
    }
    
    if (!body.address) {
        res.status(400).send("address field is required");
        return
    }

    if (!body.email) {
        res.status(400).send("email field is required");
        return
    }
// checking id is already registered
    for (let i = 0; i < data.clients.length; i++) {
        const element = data.clients[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} client exists`);
            return
        }
    }

    body.created_at = new Date()
    data.clients.push(body) // to upload body to the clients

    dataBase.writeData(data) /// write data in json file

    res.status(201).send("successfully created")
})

router.get('/', (req, res) => {
    let search = req.query.search // to find elements by ?search=
    let data = dataBase.readData()
    
    let name = data.clients
    if (!search) {
        search = ""
    }
// to search firstname and lastname 
    let list1 = data.clients.filter(e => e.firstname.toLowerCase().includes(search.toLowerCase() || e.lastname.toLowerCase().includes(search.toLowerCase())))
    

    if (list1.length == 0) {
        res.status(404).send("client firstname  and lastname do not found!")
        return
    }
    res.json(list1)

})

router.get('/:id', (req, res) => {
    let id = req.params.id
    let data = dataBase.readData()
    let client = data.clients.find(e => e.id == id) 
    if (!client) {
        res.status(400).send(`id:${id} client doesn't exist`);
        return
    }

    res.status(200).json(client)
})

router.put('/', (req, res) => {
    let body = req.body
    let data = dataBase.readData()

    let client = data.clients.find(e => e.id == body.id)

    if (!client) {
        res.status(400).send(`id:${body.id} client doesn't exist!`);
        return 
    }

    for (let i = 0; i < data.clients.length; i++) {
        const element = data.clients[i];
        if (element.id == body.id) {
            body.created_at = data.clients[i].created_at
            body.updated_at = new Date()
            data.clients[i] = body
            break;
        }
    }
    body.updated_at = new Date()
    dataBase.writeData(data)
    res.status(200).send("successfully updated")
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    let data = dataBase.readData()

    let client = data.clients.find(e => e.id == id)
    if (!client) {
        res.status(400).send(`id:${id} client doesn't exist!`);
        return
    }

    data.clients = data.clients.filter(e => e.id != id)
    dataBase.writeData(data)
    res.status(200).send("successfully deleted")
})


module.exports = {router}