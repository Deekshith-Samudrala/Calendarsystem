import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <>
        <div className='container-fluid'>
            <div className='navbar navbar-dark bg-dark navbar-expand-xl'>
                <NavLink className="navbar-brand" to="/">Dr.John</NavLink>
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <NavLink to="/book" className="nav-link">Book Event</NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink to="/show" className="nav-link">Show Event</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    </>
  )
}

export default Header