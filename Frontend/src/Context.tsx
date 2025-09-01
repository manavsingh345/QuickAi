import { createContext, type Dispatch, type SetStateAction } from "react";

type MyContextType = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  reply: string;
  setReply: Dispatch<SetStateAction<string>>;
  currThreadId:string;
  setcurrThreadId:Dispatch<SetStateAction<string>>;
};

// ✅ pass the correct type
export const MyContext = createContext<MyContextType>({
  prompt: "",
  setPrompt: () => {}, // dummy function
  reply: "",
  setReply: () => {},  // dummy function
  currThreadId:"",
  setcurrThreadId:() => {},
  
});
