import React, { useState } from "react"
import Header from "./Components/Header"
import Cards from "./Components/Cards"
import AddMovie from "./Components/AddMovie"
import { Route, Routes } from "react-router-dom"
import Detail from "./Components/Detail"
import { createContext } from "react"
import Login from "./Components/Login"
import Signup from "./Components/Signup"
const Appstate = createContext()
function App() {
  const [login , setLogin ] = useState()
  const [userName , setUserName] = useState("")
    return (
    <Appstate.Provider value={{login, setLogin, userName , setUserName}}>
      <Header/>
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/addmovie" element={<AddMovie />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Appstate.Provider>
  )
}

export default App
export {Appstate}