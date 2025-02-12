/* eslint-disable react/prop-types */
import {Navigate, useNavigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import API from "../../api"
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader"
import {  toast } from 'react-toastify';
import { useState, useEffect, useContext } from "react"
import { login, logout } from "../../authSlice";
import { PageContext } from "../../Layout/Layout";

function ProtectedRoute({children}){
    
    const [isAuthorized, setIsAuthorized] = useState(null)
    const { accessToken, refreshToken } = useSelector((state) => state.auth)
    const setPage = useContext(PageContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        auth()
    },[])
    
    const refreshTokenHandler  = async () =>{
        try {
            const res = await API.post("token/refresh/", { refresh: refreshToken});
            if (res.status === 200){
                const data_res = await API.post('user/token_data/',{'token':res.data.access})
                dispatch(login({ accessToken: res.data.access, refreshToken: res.data.refresh, username: data_res.data.username, first_name: data_res.data.first_name, last_name: data_res.data.last_name, role: data_res.data.role }));
                setIsAuthorized(true)
            } else {
                console.log('1')
                dispatch(logout());
                setIsAuthorized(false)
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            setPage('Home')
            localStorage.setItem('Page','Home')
            toast.error("Session expired. Please log in again.");
            dispatch(logout());
            setIsAuthorized(false)
        }
    }
    
    const auth = async () =>{
        if (!accessToken || !refreshToken){
            setPage('Home')
            localStorage.setItem('Page','Home')
            toast.info('Please signIn to visit this page')
            setIsAuthorized(false)
            return
        }

        try {
            const decoded = jwtDecode(accessToken)
            const tokenExpiration = decoded.exp
            const now = Date.now()/1000
            
            if (tokenExpiration < now){
                await refreshTokenHandler();
            } else {
                setIsAuthorized(true)
            }

        } catch (error) {
            console.error("Token decoding error:", error);
            dispatch(logout());
            setIsAuthorized(false);
            navigate('/sigin')
            return
        }
        

    }

    if (isAuthorized == null){
        return <Loader />
    }

    return isAuthorized ? children : <Navigate to="/sigin"/>
}

export default ProtectedRoute