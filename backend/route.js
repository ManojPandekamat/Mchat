const router=require('express').Router()

const set=new Set();
function generateCode(){
    const string='abcdefghijklmnopqrstuvwxyz0123456789'
    let code=''
    for(let i=1;i<=4;i++){
        code+=string.charAt(Math.floor(Math.random()*string.length))
    }
    if (set.has(code)){
        code = generateCode()
    }else{
        set.add(code);
    }
    return code;
}


router.get("/",(req,res)=>{
    res.send('Hello world')
})

router.get('/chat-code',(req,res)=>{
    let code =generateCode();
    console.log(code);
    if(code)
    res.status(200).json({code:code});
    else
    res.status(200).json({code:code});
})


module.exports=router