/* eslint-disable no-unused-vars */

import { useNavigate} from 'react-router-dom';
import logo from '../assets/logo.png';
import './SignIn.css';
import API from '../api';
import { useState,useEffect,useContext } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Authstate';
import { LoadingContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const SignIn = () => {

    const navigate = useNavigate();
    const { userRole, login } = useAuth();
    const [error, setError] = useState(null);
    const setIsLoading = useContext(LoadingContext);

    const messege = localStorage.getItem('messege');

    const responseGoogle = (response) => {
        console.log(response);

        axios.post('http://localhost:8000/user/google-login/', {
            access_token: response.credential
        }).then(res => {
            console.log('Login successful:', res.data);
        }).catch(err => {
            console.log('Login failed:', err);
        });
    };
    
    useEffect(() => {
        if (messege){
            toast.success(messege);
            localStorage.removeItem('messege');
        }  
    });
    
    const [formData, setFormData] = useState({
        identifire:'',
        password: '',
      });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await API.post('/user/signin/', { identifire: formData.identifire, password: formData.password });
            
            toast.success(response.data.message);
            
            login(response.data.access, response.data.refresh, {
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                Username: response.data.Username
            });
            
            localStorage.setItem('first_name', response.data.first_name);
            localStorage.setItem('last_name', response.data.last_name);
            localStorage.setItem('Username', response.data.Username);

        } catch (error) {
            setError(error.message);
            toast.error(error.response.data.message);
            if (error.response.data?.email_varify){
                try{
                    const get_email = await  API.post('/user/get_emaiil_from_id/', { identifire: formData.identifire,});  
                    toast.info('This email is not verified please verify it by otp')
                    localStorage.setItem('email', get_email.data.email);
                    navigate('/signup/enterotp');
                } catch {
                    toast.error('plese try later');
                }
                
            }
        } finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        if (userRole.isAuthenticated) {
            switch (userRole.role) {
                case 'admin':
                  navigate('/admin-panel');
                  break;
                case 'worker':
                  navigate('/worker');
                  break;
                default:
                  navigate('/');
              }
        }
      }, [userRole, navigate]);



    const navigateToGoogleLogin = () => {
        window.location.replace("http://localhost:8000/user/auth/google/"); 
    };
    return (
        <div className="container">
            
            <div className="row">
                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid logo-class">
                    <img src={logo} alt="" />
                    <h1>Work Laza</h1>
                    <span>{`"Where Works Meet Solution !"`}</span>
                </div>
                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid form-div">
                    <div className="sign_form">
                        <h2>Welcome back</h2>
                        <hr />
                        <form>
                            <div className="form-group">
                                <label htmlFor="identifire" className='label'>Username or Email or Phone</label>
                                <input type="text" className="form-input" id="identifire" required value={formData.identifire} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className='label'>Password</label>
                                <input type="password" className="form-input form-input-2" id="password" value={formData.password} required onChange={handleChange}/>
                            </div>
                            <hr />
                            <button type="submit" className="form_submit_btn" onClick={handleSubmit}>Sign In</button>
                        </form>
                        <div className="sign_up">
                            <p className='label' onClick={()=>navigate('/signUP')} style={{lineHeight:'10px'}}>{`Don't Have an account?`}<a>Please Sign Up</a></p>
                            <p className='label' onClick={()=>navigate('/Forgot')} style={{textAlign:'end'}}><a>Forgot Password?</a></p>
                        </div>
                        <div className='google_sign_in' >
                            <GoogleLogin clientId="358220686468-isdt3qooc2dedok4sg0h7kovaq2f03ld.apps.googleusercontent.com" onSuccess={responseGoogle} onFailure={responseGoogle} cookiePolicy={'single_host_origin'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn