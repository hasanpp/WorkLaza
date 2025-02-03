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


const SignIn = () => {

    const navigate = useNavigate();
    const { userRole, login } = useAuth();
    const [error, setError] = useState(null);
    const setIsLoading = useContext(LoadingContext);

    const messege = localStorage.getItem('messege');
    
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



    const reachGoogle = async() => {
        const clientID = "358220686468-isdt3qooc2dedok4sg0h7kovaq2f03ld.apps.googleusercontent.com";
        const callBackURI = "http://localhost:5173/";
        window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${clientID}&scope=openid%20email%20profile&access_type=offline`)

        setIsLoading(true);
        try {
            const res = await API.post("/dj-rest-auth/google/",{})

            toast.success(res.data.message);
            console.log('hihih');
            
            login(res.data.access, res.data.refresh, {
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                Username: res.data.Username
            });
        } catch(err) {
            toast.error(err.response.data.message)
        } finally {
            setIsLoading(false);
        }

        
    }

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
                            <p className='label' onClick={()=>navigate('/signUP')}>{`Don't Have an account?`}<a>Please Sign Up</a></p>
                            <p className='label' onClick={()=>navigate('/Forgot')}><a>Forgot Password?</a></p>
                        </div>
                        <div className='google_sign_in' >
                            <svg onClick={reachGoogle} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn