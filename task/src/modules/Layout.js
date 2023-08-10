import React from 'react'
import Header from './Components/Header'
import { Outlet } from 'react-router-dom'
import Footer from './Components/Footer'

const Layout = () => {
  return (
    <>
        <Header></Header>
        <div style={{minHeight : "700px"}}> 
          <Outlet></Outlet>
        </div>
        <Footer></Footer>
    </>
  )
}

export default Layout