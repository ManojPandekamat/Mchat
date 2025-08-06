import { useContext,createContext, useState } from "react";

const usercontext=createContext()
const  ContextProvider=({children})=>{

  const [me,setMe]=useState("xyz");
    const [users, setUsers] = useState(0);
  
    return(
        <usercontext.Provider value={{me,users,setMe,setUsers}} >
                {children}
        </usercontext.Provider>
    )
}

export const  useData=()=>(useContext(usercontext))

export default ContextProvider;