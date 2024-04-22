import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from "context/SessionStorageContext"; 
import { useCallback  } from "react";

export const useClearStorage = () => {
    const { resetValues } = useSessionStorage();
    const navigate = useNavigate();

    const clearStorage = useCallback(() => {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('roleid');
        sessionStorage.removeItem('companyid');
        sessionStorage.removeItem('profileimg');
        sessionStorage.removeItem('usertype');
        sessionStorage.removeItem('companyname');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('states');
        sessionStorage.removeItem('appliedFilters');
        sessionStorage.removeItem('candidateFilters');
        sessionStorage.removeItem('packageid');
        sessionStorage.removeItem('packageDetails');
        sessionStorage.removeItem('packageInfo');
        sessionStorage.removeItem('pageNo');
        sessionStorage.removeItem('candidatePageNo');
        localStorage.clear();
        resetValues();
        navigate('/');
    },[resetValues,navigate]);

    return { clearStorage };
};