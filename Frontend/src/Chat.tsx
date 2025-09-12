import { MyContext } from "./Context"
import { useContext, useEffect, useState } from "react"
import "./Chat.css"
import ResponseRenderer from "./ResponseRenderer"
export default function Chat(){
    const {newChat,prevChats,reply} = useContext(MyContext);
    const [latestReply,setLatestReply]=useState("");

    useEffect(()=>{
        if(reply===""){
            setLatestReply("");     //prevChats ko load kar rhe hai
            return;
        }
        if(!prevChats.length) return;

        const content=reply.split(" ");
        let idx=0;
        const interval=setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" "));
            idx++;

            if(idx>=content.length) clearInterval(interval);
        },40);
        return () => clearInterval(interval);
    },[prevChats,reply]);
    return (
        <>
        {newChat && <h1 className="text-3xl">Qucik Ai Welcome's you!</h1>}
        <div className="chats w-full">
            {
                prevChats?.slice(0,-1).map((chat,idx)=>
                <div className={chat.role==="user" ? "userDiv" : "gptDiv"} key={idx}>
                    {chat.role==="user" ? 
                    <p className="userMessage">{chat.content}</p> : 
                    <div className="prose max-w-none dark:prose-invert">
                    <ResponseRenderer content={chat.content} />
                </div>
                    }
                </div>
            )
            }
            {
                prevChats.length>0 && latestReply!=="" && 
                <div className="gptDiv" key={"typing"}>
                    <ResponseRenderer content={latestReply}/>
                </div>
            }
            {
                prevChats.length>0 && latestReply ==="" &&          //store the last reply answer also to display
                <div className="gptDiv" key={"non-typing"}>
                    <ResponseRenderer content={prevChats[prevChats.length-1].content}/>    
                </div>
            }
            
        </div>
        </>
    )
}