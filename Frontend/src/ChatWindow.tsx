import { useContext,useState,useEffect } from "react"
import Chat from "./Chat"
import "./ChatWindow.css"
import { MyContext } from "./Context"
import { RingLoader } from "react-spinners"
import { ModeToggle } from "./components/mode-toggle"


export default function ChatWindow(){
    const {prompt,setPrompt,reply,setReply,currThreadId,setprevChats,setnewChat}=useContext(MyContext);
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
    // const handleFile=  ()=>{
    //     const el=document.createElement("input");
    //     el.setAttribute("type","file");
    //     el.setAttribute("accept","application/pdf");
    //     el.addEventListener('change', async ()=>{
    //         if(el.files && el.files.length>0){
    //             const file=el.files.item(0);
    //             if(file){
    //                 const formData = new FormData();
    //                 formData.append('pdf',file);
    //                 const response=await fetch("http://localhost:8000/api/upload/pdf",{
    //                     method:"POST",
    //                     body:formData,
    //                 });
    //                 console.log(response);
    //             }
                
               
    //            console.log("file uploaded");
    //         }
    //     })
    //     el.click();
    // }
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
        <div className="chatWindow h-screen w-full flex flex-col justify-between items-center text-center bg-white text-black dark:bg-black dark:text-white">
        <div className="w-full flex justify-between items-center">
            <span className="m-4">QuickAi</span>
            
            <div className="m-4 pr-4">
            
               <span className="h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"> <ModeToggle></ModeToggle></span>
            </div>
        </div>
        <Chat></Chat>
        <RingLoader color="#fff" loading={loader}/>

        <div className="flex flex-col justify-center items-center w-full">
            <div className="inputBox w-full flex justify-between items-center relative">
                {/* <div className="h-10 w-10"><input type="file" id="file" accept="application/pdf" placeholder="Choose file"/></div> */}
               {/* <div className="file cursor-pointer"onClick={handleFile}><i className="fa-solid fa-file-pdf"></i></div> */}
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