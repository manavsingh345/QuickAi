import "./Sidebar.css"
import { useContext, useEffect } from "react"
import { MyContext } from "./Context"
import {v1 as uuidv1} from "uuid";

interface Thread {
  threadId: string;
  title: string;
}
export default function Sidebar(){

    const {allThreads,setAllThreads,currThreadId,setPrompt,setnewChat,setReply,setcurrThreadId,setprevChats} = useContext(MyContext);
    const getAllThreads = async () => {
        try{
            const response=await fetch("http://localhost:8000/api/thread");
            const res=await response.json();
            // const filterData= res.map((thread => {threadId:thread.threadId, title:thread.title})
            const filterData =await res.map((thread:Thread) => ({ threadId: thread.threadId, title: thread.title}));
            console.log(filterData);
            setAllThreads(filterData);
        }catch(e){
            console.log(e);
        }
    }
    useEffect(()=>{
        getAllThreads();
    },[currThreadId]);

    const NewChat = async () => {
        setnewChat(true);
        setPrompt("");
        setReply("");
        setcurrThreadId(uuidv1());
        setprevChats([]);
    }
    return(
        <section className="Sidebar flex flex-col justify-between h-screen" onClick={NewChat}>
            <button className="flex justify-between items-center cursor-pointer">
                <img src="src\assets\blacklogo.png" alt="chatgptLogo" className="logo"/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread:Thread,idx:number) =>(
                        <li key={idx}>{thread.title}</li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>Apna College</p>
            </div>
        </section>
    )
};