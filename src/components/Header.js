import React, { useEffect, useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {imagePath} from 'components/Constants';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSessionStorage } from 'context/SessionStorageContext';
import { FaUser } from "react-icons/fa";
import { useClearStorage } from 'utils/useClearStorage';
import axios from 'axios';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Header() {
  const [expanded, setExpanded] = useState(false);
  const { username, token, userid, usertype, profileimg, setUsername, setToken, setUserid, setProfileimg, setUsertype, companyname, setCompanyname, setCompanyid, setRoleid, setUser, setPackageDetails, setPackageid, setPackageInfo } = useSessionStorage();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showReportsSubMenuOne, setShowReportsSubMenuOne] = useState(false);
  const { clearStorage } = useClearStorage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const checkLocalStorage = () => {
    const userId = localStorage.getItem("userid");
    const userType = localStorage.getItem("usertype");
    const userName = localStorage.getItem("username");
    return userId && userType && userName;
  };

  const handleLocalStorageUser = useCallback( async () => {
    const userId = localStorage.getItem("userid");
    const userType = localStorage.getItem("usertype");  
    if(userId && userType) {
      const user = {
        userId,
        userType
      };
      const response = await axios.post(BASE_API_URL + 'user-login/finduser/', user);
      if (response?.data?.result === true) {
          setUsername(response.data.data.username);
          setUserid(response.data.data.userid);
          setToken(response.data.data.token);
          setUsertype(response.data.data.userType);
          setProfileimg(response.data.data.profileImg);
          setCompanyname(response.data.data.companyname);
          setCompanyid(response.data.data.companyid);
          setRoleid(response.data.data.roleid);
          setUser(JSON.stringify(response.data.data.user));
          setPackageid(response.data.data.packageid);
          setPackageDetails(JSON.stringify(response.data.data.packageDetails));
          setPackageInfo(JSON.stringify(response.data.data.packageInfo));
          navigate(location.pathname);
          setLoggedIn(true);
      } else {
          setLoggedIn(false);
          clearStorage();
          navigate("/login");
      }
    }
  },[navigate, setUsername, setToken, setUserid, location, setLoggedIn, setProfileimg, setUsertype, setCompanyname, setCompanyid, setRoleid, setUser, setPackageDetails, setPackageid, setPackageInfo, clearStorage])

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    const userType = localStorage.getItem("usertype");
    const userName = localStorage.getItem("username");
    if (username && token && userid === userId && usertype === userType && username === userName) {
      setLoggedIn(true);
    } else if (checkLocalStorage()) {
      handleLocalStorageUser();
    } else {
      setLoggedIn(false);
      const candidatePaths = [ "/candidate/dashboard","/candidate/profile","/candidate/change-password","/candidate/resume","/candidate/applied-jobs","/candidate/saved-jobs"];
      const employerPaths = [ "/employer/dashboard","/employer/company-profile","/employer/profile","/employer/change-password","/employer/post-new-job","/employer/manage-jobs","/employer/manage-users","/employer/manage-candidates/:slug","/employer/support","/candidates"];
      if (candidatePaths.includes(location.pathname)) {
        navigate("/login");
      }
      if (employerPaths.includes(location.pathname)) {
        navigate("/employer/login");
      }
    }
  }, [navigate, username, token, userid, usertype, companyname, setUsername, setToken, setUserid, location, setLoggedIn, profileimg, setProfileimg, setUsertype, handleLocalStorageUser, clearStorage]);

  const closeNavbar = () => {
    setExpanded(false);
  };

  const handleLogout = () => {
    clearStorage();
    setExpanded(false);
    setShowReportsSubMenuOne(false);
    setLoggedIn(false);
    navigate("/");
  }
  
  return (
    <header>
      <Navbar expand="lg" className="bg-white" expanded={expanded} onToggle={(expanded) => setExpanded(expanded)}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/" onClick={closeNavbar}><img className="img-fluid h-35" src={imagePath.logo} alt="logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <NavLink to="/blogs" exact="true" className="nav-link" activeclassname="active" onClick={closeNavbar}>Blogs</NavLink>
              {
                loggedIn ? (
                  <>
                    <NavLink to="/my-blogs" exact="true" className="nav-link" activeclassname="active" onClick={closeNavbar}>My Blogs</NavLink>
                    {
                      usertype === "employer" ? (
                        <NavLink to="/candidates" exact="true" className="nav-link" activeclassname="active" onClick={closeNavbar}>Find Candidates</NavLink>
                      ) : (
                        <NavLink to="/jobs" exact="true" className="nav-link" activeclassname="active" onClick={closeNavbar}>Find Jobs</NavLink>
                      )
                    }
                    <NavDropdown title={<><FaUser className="icon-14 top-n1" /> {username}</>} show={showReportsSubMenuOne} onMouseEnter={() => setShowReportsSubMenuOne(true)} onMouseLeave={() => setShowReportsSubMenuOne(false)}>
                      {
                        usertype === "candidate" ? (
                          <>
                            <NavDropdown.Item as={Link} to="/candidate/dashboard" onClick={closeNavbar}>Dashboard</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/candidate/profile" onClick={closeNavbar}>Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/" onClick={handleLogout}>Logout</NavDropdown.Item>
                          </>
                        ) : (
                          <>
                            <NavDropdown.Item as={Link} to="/employer/dashboard" onClick={closeNavbar}>Dashboard</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/employer/profile" onClick={closeNavbar}>Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/" onClick={handleLogout}>Logout</NavDropdown.Item>
                          </>
                        )
                      }
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <NavLink to="/jobs" exact="true" className="nav-link" activeclassname="active" onClick={closeNavbar}>Find Jobs</NavLink>
                    <NavLink exact="true" className="nav-link" to="/login" onClick={closeNavbar}>Login</NavLink>
                    <NavLink exact="true" className="nav-link" to="/signup" onClick={closeNavbar}>Register</NavLink>
                    <NavDropdown title="Employer" show={showReportsSubMenuOne} onMouseEnter={() => setShowReportsSubMenuOne(true)} onMouseLeave={() => setShowReportsSubMenuOne(false)}>
                      <NavDropdown.Item as={Link} to="/employer/login" onClick={closeNavbar}>Login</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/employer/signup" onClick={closeNavbar}>Register</NavDropdown.Item>
                    </NavDropdown>
                  </>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}