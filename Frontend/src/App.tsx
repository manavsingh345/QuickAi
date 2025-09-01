import './App.css'
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MyContext } from './Context';
import { use, useState } from 'react';
import "./index.css"
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt,setPrompt] = useState("");
  const [reply,setReply] = useState("");
  const [currThreadId,setcurrThreadId] = useState<string>(uuidv1());

  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setcurrThreadId
  };


  return (
    
    <div className='app'>
      <MyContext.Provider value = {providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
   
  )
}

export default App
