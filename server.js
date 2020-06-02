const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

const PORT = process.env.PORT || 4000;



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})