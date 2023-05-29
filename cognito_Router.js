const express = require('express');
const router = express.Router()
const cognito = require('./cognito_Controller');
const { response } = require('./app');

router.post('/signup', async (req, res)=>{
    const {body} = req
    let {name, email, password} = body;
    console.log(body)
    try{
        let result = await cognito.signUp(name, email, password);
        let response = {
            username: result,
            id: result.userSub,
            success: true
        }
        res.status(200).json({"result":"Successfully registered"})
        console.log("User registered successfully")
    }catch(err){
        console.log("Hellooooo",err)
        res.status(500).json({"result":err})
    }  
});

router.post('/signin', async (req, res)=>{
    const {body} = req;
    let {email, password} = body
    try{
        let result = await cognito.signIn(email, password)
        let response ={

        }
        res.status(200).json({'result': result})
    }catch(err){
        console.log(err)
        res.status(404).json({'result': err})
    }
})


router.post('/code', async (req, res)=>{
    const {body} = req;
    // console.log(body)
    // let {name, password} = body
    if(body.email && body.code){
        const {email, code} = body;
        try{
            let result = await cognito.verifyCode(email, code)
            let response ={
    
            }
            res.status(200).json({'result': result})
        }catch(err){
            console.log(err)
            res.status(404).json({'result': err})
        }
    }else{
        res.status(400).json({"error":"bad format"});
    }
});

router.post('/change_password', async (req, res)=>{
    const {body} = req;
    // console.log(body)
    // let {name, password} = body
    if(body.email && body.password && body.newpassword){
        const {email, password, newpassword} = body;
        try{
            let result = await cognito.changePwd(email, password, newpassword)
            let response ={
    
            }
            res.status(200).json({'result': result})
        }catch(err){
            console.log(err)
            res.status(404).json({'result': err})
        }
    }else{
        res.status(400).json({"error":"bad format"});
    }
});

router.post('/delete', async (req, res)=>{
    const {body} = req;
    if(body.email && body.password){
        const {email, password} = body;
        try{
            let result = await cognito.delete(email, password)
            let response ={
    
            }
            res.status(200).json({'result': result})
        }catch(err){
            console.log(err)
            res.status(404).json({'result': err})
        }
    }else{
        res.status(400).json({"error":"bad format"});
    }
});

router.post('/forgot', async (req, res)=>{
    const {body} = req;
    console.log(body)
    let {name, password} = body
    if(body.email && body.password){
        const {email, password, newpassword} = body;
        try{
            let result = await cognito.forgotpwd(email, password)
            let response ={
    
            }
            res.status(200).json({'result': result})
        }catch(err){
            console.log(err)
            res.status(404).json({'result': err})
        }
    }else{
        res.status(400).json({"error":"bad format"});
    }
});

module.exports = router;