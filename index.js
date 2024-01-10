const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/', (req, res) => {
    res.send('ToDo Server is Running. cors init. Ready To Load API')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})