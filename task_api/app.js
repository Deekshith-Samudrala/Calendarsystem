const express = require("express");
const app = express();
const cors = require("cors");
const routes = require('./config/routes');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(routes);

const port = process.env.PORT || 3001;

app.listen(port,()=>{
    console.log(`p2etask project running on port ${port}`);
})
