import Chat from "./Chat"
import "./ChatWindow.css"
export default function ChatWindow(){
    return(
        <div className="chatWindow h-screen w-full flex flex-col justify-between items-center text-center">
        <div className="w-full flex justify-between items-center">
            <span className="m-4">QuickAi</span>
            <div className="m-4 pr-4">
               <span className="userIcon h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-user"></i></span>
            </div>
        </div>
        <Chat></Chat>

        <div className="flex flex-col justify-center items-center w-full">
            <div className="inputBox w-full flex justify-between items-center relative">
                <input type="text" placeholder="Ask anything" className="w-full"/>
                <div id="submit" className="cursor-pointer absolute flex justify-center items-center text-xl">
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