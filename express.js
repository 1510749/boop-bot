const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Ok'))

app.listen(process.env.PORT, () => console.log())