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
            const filterData =await res.map((thread:Thread) => ({ threadId: thread.threadId, title: thread.title}));
            setAllThreads(filterData);
        }catch(e){
            console.log(e);
        }
    }
    useEffect(()=>{
        getAllThreads();
    },[currThreadId]);

    const NewChat =() => {
        setnewChat(true);
        setPrompt("");
        setReply("");
        setcurrThreadId(uuidv1());
        setprevChats([]);
    }

    const changeThread= async (newthreadId:string)=>{
        setcurrThreadId(newthreadId);
        try{
            const response=await fetch(`http://localhost:8000/api/thread/${newthreadId}`);
            const res=await response.json();
            console.log(res);
            setprevChats(res);
            setnewChat(false);
            setReply("");
        }catch(e){
            console.log(e);
        }
    }
    const deleteThread= async(threadId:string)=>{
        try{
            await fetch(`http://localhost:8000/api/thread/${threadId}`,{method:"DELETE"});
            setAllThreads(prev => prev.filter(thread=>thread.threadId !== threadId));
            if(threadId === currThreadId){
                NewChat();
            }
        }catch(e){  
            console.log(e);
        }
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
                        <li key={idx} onClick={() => changeThread(thread.threadId)}>{thread.title} <i className="fa-solid fa-trash"
                        onClick={(e)=>{
                            e.stopPropagation(); //stop event bubbling
                            deleteThread(thread.threadId);
                        }}></i></li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>Apna College</p>
            </div>
        </section>
    )
};