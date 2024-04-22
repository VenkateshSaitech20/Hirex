import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const SessionStorageContext = createContext();

export const SessionStorageProvider = ({ children }) => {
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [userid, setUserid] = useState(sessionStorage.getItem('userid'));
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [profileimg, setProfileimg] = useState(sessionStorage.getItem('profileimg'));
  const [usertype, setUsertype] = useState(sessionStorage.getItem('usertype'));
  const [companyname, setCompanyname] = useState(sessionStorage.getItem('companyname'));
  const [companyid, setCompanyid] = useState(sessionStorage.getItem('companyid'));
  const [roleid, setRoleid] = useState(sessionStorage.getItem('roleid'));
  const [user, setUser] = useState(sessionStorage.getItem('user'));
  const [packageid, setPackageid] = useState(sessionStorage.getItem('packageid'));
  const [packageDetails, setPackageDetails] = useState(sessionStorage.getItem('packageDetails'));
  const [packageInfo, setPackageInfo] = useState(sessionStorage.getItem('packageInfo'));

  const resetValues = () => {
    setUsername(null);
    setToken(null);
    setUserid(null);
    setProfileimg(null);
    setUsertype(null);
    setCompanyname(null);
    setCompanyid(null);
    setRoleid(null);
    setUser(null);
    setPackageDetails(null);
    setPackageInfo(null);
    setPackageid(null);
  };

  const contextValue = useMemo(() => ({ username, setUsername, token, setToken, userid, setUserid, profileimg, setProfileimg, usertype, setUsertype, companyname, setCompanyname, companyid, setCompanyid, roleid, setRoleid, user, setUser, packageDetails, setPackageDetails, packageid, setPackageid, packageInfo, setPackageInfo, resetValues }), [username, token, userid, profileimg, usertype, companyname, companyid, roleid, user, packageDetails, packageid, packageInfo]);

  useEffect(() => {
    if (username !== null && token !== null && userid !== null && usertype !== null) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userid', userid);
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('profileimg', profileimg);
      sessionStorage.setItem('usertype', usertype);
      sessionStorage.setItem('companyname', companyname);
      sessionStorage.setItem('companyid', companyid);
      sessionStorage.setItem('roleid', roleid);
      sessionStorage.setItem('user', user);
      sessionStorage.setItem('packageDetails', packageDetails);
      sessionStorage.setItem('packageid', packageid);
      sessionStorage.setItem('packageInfo', packageInfo);
    }
  }, [username, token, userid, profileimg, usertype, companyname, companyid, roleid, user, packageDetails, packageid, packageInfo]);

  return (
    <SessionStorageContext.Provider value={contextValue}>
      {children}
    </SessionStorageContext.Provider>
  );
};

SessionStorageProvider.propTypes = {
    children : PropTypes.any
}

export const useSessionStorage = () => {
  return useContext(SessionStorageContext);
};