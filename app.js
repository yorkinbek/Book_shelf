const PORT = 3001;

const express = require('express')

const app = express()

app.use(express.json())

const loggerMiddeware = (req, res, next) => {
    let d = new Date,
        dformat = [d.getDate(),
        d.getMonth() + 1,
        d.getFullYear()].join('/') + ' ' +
            [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
    next()
    let diff = new Date() - d
}

app.use('/', loggerMiddeware)



const clientRouter = require('./routers/client')
const bookRouter = require('./routers/book')
const client_bookRouter = require('./routers/client_book')

app.use('/client', clientRouter.router)
app.use('/book', bookRouter.router)
app.use(client_bookRouter)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})