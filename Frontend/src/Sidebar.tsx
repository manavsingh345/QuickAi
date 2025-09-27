import "./Sidebar.css"
import { useContext, useEffect, useState } from "react"
import { MyContext } from "./Context"
import {v1 as uuidv1} from "uuid";

interface Thread {
  threadId: string;
  title: string;
}
export default function Sidebar(){

    const {allThreads,setAllThreads,currThreadId,setPrompt,setnewChat,setReply,setcurrThreadId,setprevChats} = useContext(MyContext);
    const [CardOpen,SetCardOpen]=useState(false);
    const [sidebarOpen,setsidebarOpen]=useState(true);

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
    const Card= async ()=>{
        SetCardOpen((prev)=>!prev);
    }
    const Side=async()=>{
        setsidebarOpen((prev)=>!prev);
    }
    return(
        <div className={`side  ${sidebarOpen ? "open" : "closed"}`}>
            <button onClick={Side}><img src="src\assets\expand.png"  className="h-6 w-7" alt="Menu" /></button>
        {sidebarOpen && <section className="Sidebar flex flex-col justify-between h-screen" >
            <button className="flex justify-between items-center cursor-pointer" onClick={NewChat}>
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

            <div className="sign flex pt-4 pl-2 bottom-0 fixed cursor-pointer mt-auto" onClick={Card}>
                <span className="userIcon h-6 w-6 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-user"></i></span>
                <p className="pl-2">Manav Singh</p>
            </div>

           {CardOpen && <div className="h-100 w-60 bg-gray-700 m-4 rounded-lg pr-4 mr-4 mb-15 bottom-0 left-0" >
           <div className="flex"><span className="flex justify-center p-2 text-sm "><i className="fa-solid fa-user mr-2 pt-1"></i>manavsingh321@gmail.com</span>
            </div>

           <div className="m-2 p-2">
                <p className="pb-4"><i className="fa-solid fa-moon pr-6"></i>Apperance</p>
                <p><i className="fa-solid fa-gear pr-6"></i>Settings</p>   
           </div>
           <hr />
           <button><i className="fa-solid fa-right-from-bracket pr-6"></i>Log out</button>
        </div>}
        </section>}
        </div>
        
    )
};