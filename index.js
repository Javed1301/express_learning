import express from 'express'
import 'dotenv/config'

import path from "path";
import { fileURLToPath } from "url";
import logger from './logger.js'
import morgan from 'morgan'

const app = express()

const port =  process.env.PORT || 3000

//shortcomings of console log and improvising our console log

// accepting  data from frontend side.

// Get the current directory name (__dirname equivalent for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())


//improving my console log for trackingg the activity which helps me to the debugging
const morganFormat = ':method :url :status :response-time ms'

app.use(morgan(morganFormat,{
    stream: {
        write: (message)=>{
            const logObject = {
                method: message.split(' ')[0],
                url: message.split(' ')[1],
                status: message.split(' ')[2],
                responseTime: message.split(' ')[3],
            };
            logger.info(JSON.stringify(logObject));
        }
    }
}))
let teaData = []
let nextid = 1

app.get("/", (req, res) => {
    // Serve index.html from the current directory
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index2.html", (req, res) => {
    // Serve index.html from the current directory
    res.sendFile(path.join(__dirname, "index2.html"));
});
app.get("/logger.html", (req, res) => {
    // Serve index.html from the current directory
    res.sendFile(path.join(__dirname, "logger.html"));
});

app.post('/teas',(req,res) =>{
    console.log("POST")
    const {name,price}=req.body
    const newTea = {id: nextid++,name,price}
    teaData.push(newTea)
    res.status(201).send(newTea)
})
app.get('/teas',(req,res)=>{
    res.status(200).send(teaData  )
})

app.get('/teas/:id',(req,res)=>{
    const tea = teaData.find(t=>t.id === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send('Tea not found')
    }
    res.status(200).send(tea)
})

//update tea

app.put('/teas/:id',(req,res)=>{
    const tea = teaData.find(t=>t.id === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send('Tea not found')
    }
    const {name,price} = req.body
    tea.name = name
    tea.price = price
    res.status(200).send(tea)
})

//delete tea

app.delete('/teas/:id',(req,res)=>{
    const index = teaData.findIndex(t=>t.id === parseInt(req.params.id))
    if(index === -1){
        return res.status(404).send('Tea not found')
    }
   teaData.splice(index,1)
    res.status(200).send('deleted')
})
app.listen(port,()=>{
    console.log(`Server is running at port : ${port}...`)
})