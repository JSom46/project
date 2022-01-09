import { useState, useEffect } from 'react';
import {
  Navbar,NavbarBrand,Collapse,Nav,NavItem,NavLink,NavbarText,NavbarToggler//,UncontrolledDropdown,DropdownItem,DropdownMenu,DropdownToggle
} from 'reactstrap';

const BootstrapNavbar = () => {

  const [auth, setAuth] = useState("");
  useEffect(() => {
        
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:2400/auth/loggedin', {
            method: 'GET',
            credentials: 'include'
        });
        const json = await response.json();
        // console.log(json);
        setAuth(json);
    } catch (error) {
        console.log("error", error);
    }
};

fetchData();
}, []);
  return(
  <Navbar
  color="dark"
  dark
  expand="md"
  light
  >
  <NavbarBrand href="/">
  PZ-XIV
  </NavbarBrand>
  <NavbarToggler onClick={function noRefCheck(){}} />
  <Collapse navbar>
  <Nav
  className="me-auto"
  navbar
  >
  <NavItem>
  <NavLink href="/register/">
  Rejestracja
  </NavLink>
  </NavItem>
  <NavItem>
  <NavLink href="/login/">
  Logowanie
  </NavLink>
  </NavItem>
  <NavItem>
  <NavLink href="/activate/">
  Aktywacja
  </NavLink>
  </NavItem>
  {/* <UncontrolledDropdown
    inNavbar
    nav
    >
    <DropdownToggle
    caret
    nav
    >
    Options
    </DropdownToggle>
    <DropdownMenu right>
    <DropdownItem>
    Option 1
    </DropdownItem>
    <DropdownItem>
    Option 2
    </DropdownItem>
    <DropdownItem divider />
    <DropdownItem>
    Reset
    </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown> */}
  </Nav>
  <NavbarText>
    {auth?.login}
  </NavbarText>
  </Collapse>
  </Navbar>
  )
};
  
  export default BootstrapNavbar;