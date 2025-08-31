import './App.css'
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MyContext } from './Context';
import "./index.css"

function App() {

  const providerValues={};
  return (
    
    <div className='app'>
      <MyContext.Provider value = {providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
   
  )
}

export default App
