import { useContext,useState,useEffect } from "react"
import Chat from "./Chat"
import "./ChatWindow.css"
import { MyContext } from "./Context"
import { RingLoader } from "react-spinners"
import { ModeToggle } from "./components/mode-toggle"

export default function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currThreadId,setcurrThreadId,prevChats,setprevChats,setnewChat}=useContext(MyContext);
    const [loader,setloader]=useState<boolean>(false);
   

    const getReply= async ()=>{
        setloader(true);
        setnewChat(false);
        const payload={
            message:prompt,
            threadId:currThreadId

        }
        const options = {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(payload),
        };
        try{
            const response=await fetch("http://localhost:8000/api/chat",options);
            const data=await response.json();
            console.log(data);
            setReply(data.reply);
        }catch(err){
            console.log(err);
        }
        setloader(false);
    }   

    //Append newChats to prevChats
    useEffect(()=>{
        if(prompt && reply){
            setprevChats(prevChats => (
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ))
        }
        setPrompt("");
    },[reply]);

    return(
        <div className="chatWindow h-screen w-full flex flex-col justify-between items-center text-center">
        <div className="w-full flex justify-between items-center">
            <span className="m-4">QuickAi</span>
            <ModeToggle></ModeToggle>
            <div className="m-4 pr-4">
               <span className="userIcon h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-user"></i></span>
            </div>
        </div>
        <Chat></Chat>
        <RingLoader color="#fff" loading={loader}/>
        <div className="flex flex-col justify-center items-center w-full">
            <div className="inputBox w-full flex justify-between items-center relative">
                <textarea  placeholder="Ask anything" className="w-full"
                value={prompt} onChange={(e)=>setPrompt(e.target.value)}
                onKeyDown={(e)=> e.key === 'Enter'? getReply() : '' }/>

                <div id="submit" onClick={getReply} className="cursor-pointer absolute flex justify-center items-center text-xl">
                    <i className="fa-solid fa-paper-plane"></i>
                </div>
            </div>
            <p className="info text-1xl">
                Quick Ai can make mistakes. Check important info. See Cookie Preferences.
            </p>
        </div>
        </div>
    )
};