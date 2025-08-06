import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Styles/Home.css'
import Card from '../Components/Card'
import Name from '../Components/Name'
function Home() {
  const [haveCode,setHaveCode]=useState(false);
  const [code,setCode]=useState('');
  const navigator=useNavigate();
  useEffect(()=>{
    if(code.length===4){
      setHaveCode(true);
      let fun=()=>{
      navigator(`/chat/${code}`)
      }
      fun();
    }else{
      setHaveCode(false)
    }
  },[code])

  async function createRoom(){
    try
    {const response=await axios.get(`${process.env.REACT_APP_BACKEND_ADDRESS}/chat-code`)
    const code= response.data;
    if(code)
    navigator(`/chat/${code.code}`)
  else{
    alert('no code found');
  }
}catch(e){
  console.error(e);
}
  }



  return (
    <div className='home' >
        <Name />

        <Card/>
        <section className='links'>
             <section className='sub-name'>Create a room and share friends..?</section>
            <button className='link' onClick={createRoom}>Create a chat</button>
            {/* <section className='join-room'> */}
             <section className='sub-name'>Already have a Room code..?</section>
              <input placeholder='Enter code' value={code} onChange={(e)=>{setCode(e.target.value)}} ></input>

        </section>
    </div>
  )
}

export default Home