import express from 'express'

import path from "path";
import { fileURLToPath } from "url";


const app = express()

const port = 3000


// // how to respond to a req by using a "get" method in express
// app.get("/",(req,res) =>{
//     res.send("Hello from Javed and his Tea!..")
// })
// app.get("/ice-tea",(req,res) =>{
//     res.send("What ice Tea would you prefer?..")
// })
// app.get("/watsapp",(req,res) =>{
//     res.send("Javed is available at watsapp..")
// })


// accepting  data from frontend side.

// Get the current directory name (__dirname equivalent for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())

let teaData = []
let nextid = 1

app.get("/", (req, res) => {
    // Serve index.html from the current directory
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/teas',(req,res) =>{
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