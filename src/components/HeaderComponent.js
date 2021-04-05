import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Button
} from 'react-bootstrap';
import basicUrl from './basicUrl'


const HeaderComponent = (props) => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">GeTaJoB.CoM</Navbar.Brand>
    <Nav className="mr-auto">
    </Nav>
    {props.isauth?
      <Button variant="outline-info" onClick={()=>props.handleLogout()}>Log Out</Button>
      :null}
  </Navbar>
  </>
  );
}

export default HeaderComponent;