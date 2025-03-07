import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserInfo, logout } from "~/api";
import Cookies from 'js-cookie'; 

export const useCheckAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
      }, [])
    
    const checkAuth = async () => {
        try {
            await getUserInfo();
        }
        catch(e) {
            Cookies.remove("authenticationToken");
            navigate("/login");
        }
    };
}