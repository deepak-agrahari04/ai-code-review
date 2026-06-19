const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')
const path = require('path')

const app = express();

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
        res.send('Hello Deepak');
})

app.use('/ai', aiRoutes)

// Serve frontend static files when in production and a build exists
const frontendDist = path.join(__dirname, '../Frontend/dist')
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(frontendDist))
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'))
    })
}

module.exports = app