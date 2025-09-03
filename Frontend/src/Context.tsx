import { createContext, type Dispatch, type SetStateAction } from "react";
type Chat = {
  role: string;
  content: string;
};
type MyContextType = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  reply: string;
  setReply: Dispatch<SetStateAction<string>>;
  currThreadId:string;
  setcurrThreadId:Dispatch<SetStateAction<string>>;
  newChat:boolean;
  setnewChat:Dispatch<SetStateAction<boolean>>;
  prevChats: Chat[];
  setprevChats: Dispatch<SetStateAction<Chat[]>>;
};


export const MyContext = createContext<MyContextType>({
  prompt: "",
  setPrompt: () => {}, // dummy function
  reply: "",
  setReply: () => {},  // dummy function
  currThreadId:"",
  setcurrThreadId:() => {},
  newChat:true,
  setnewChat:()=>{},
  prevChats:[],
  setprevChats:()=>{}
  
});
