import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import './App.css'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Chat from './pages/chat.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/chat' element={
        <ProtectedRoute>
        <Chat/>
        </ProtectedRoute>
        } />
    </Routes>
    </BrowserRouter>
  )
}

export default App
