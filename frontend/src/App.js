import Home from './Screens/Home'
import Chat from './Screens/Chat'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ContextProvider from './Context/Context'

function App() {
 return(
  <div>
    <ContextProvider>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/chat/:roomId' element={<Chat/>} />
      </Routes>
    </BrowserRouter>
    </ContextProvider>
  </div>
 )
}

export default App;
