import './App.css'
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MyContext } from './Context';
import { useState } from 'react';
import "./index.css"
import {v1 as uuidv1} from "uuid";

type Chat = {
  role: string;
  content: string;
};

function App() {
  const [prompt,setPrompt] = useState("");
  const [reply,setReply] = useState("");
  const [currThreadId,setcurrThreadId] = useState<string>(uuidv1());
  const [prevChats,setprevChats]=useState<Chat[]>([]); //store all the chats of current thread
  const [newChat,setnewChat]=useState(true);

  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setcurrThreadId,
    newChat,setnewChat,
    prevChats,setprevChats
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
