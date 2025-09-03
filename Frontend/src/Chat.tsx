import { MyContext } from "./Context"
import { useContext } from "react"
import "./Chat.css"
export default function Chat(){
    const {newChat,prevChats} = useContext(MyContext);
    return (
        <>
        {newChat && <h1 className="text-3xl">Qucik Ai Welcome's you!</h1>}
        <div className="chats">
            {
                prevChats?.map((chat,idx)=>
                <div className={chat.role==="user" ? "userDiv" : "gptDiv"} key={idx}>
                    {chat.role==="user" ? <p className="userMessage">{chat.content}</p> : <p className="gptMessage">{chat.content}</p>}
                </div>
            )
            }
            
        </div>
        </>
    )
}