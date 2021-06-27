const express =require('express')
const app=express()

app.get('/',(req,res)=>{
res.send('hello, word')

})

app.listen(5000,()=>{console.log('serveur running at http://localhost:5000/')
})