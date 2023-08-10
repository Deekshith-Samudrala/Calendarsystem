import React from 'react';
import { Route,Routes } from 'react-router-dom';
import Layout from '../modules/Layout';
import Dashboard from '../modules/Pages/Dashboard';
import Bookevent from '../modules/Pages/Bookevent';
import Showevents from '../modules/Pages/Showevents';

const Allroutes = () => {
  return (
    <React.Fragment>
        <Routes>
            <Route element={<Layout></Layout>}>
                <Route path="/" element={<Dashboard></Dashboard>}></Route>
                <Route path="/book" element={<Bookevent></Bookevent>}></Route>
                <Route path="/show" element={<Showevents></Showevents>} ></Route>
            </Route>
        </Routes>
    </React.Fragment>
  )
}

export default Allroutes