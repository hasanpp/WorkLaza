/* eslint-disable no-unused-vars */
import { useNavigate} from 'react-router-dom';
import logo from '../assets/logo.png';
import './SignIn.css';
import API from '../api';
import { useState,useEffect,useContext } from 'react';
import {  toast } from 'sonner';
import { LoadingContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch,useSelector } from 'react-redux';
import { login } from '../authSlice';



const SignIn = () => {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const setIsLoading = useContext(LoadingContext);
    const dispatch = useDispatch();
    const { role,isAuthenticated } = useSelector((state) => state.auth)
    const messege = localStorage.getItem('messege');
    const google_clint_id = import.meta.env.VITE_GOOGLE_CLINT_ID;

    const responseGoogle =  async(response) => {
        setIsLoading(true);
        try {
                const res =  await API.post('user/google-login/', { access_token: response.credential })

                const username = res.data.username
                const password = res.data.password
                const new_res = await API.post('token/',{ username:username, password:password})
                const data_res = await API.post('user/token_data/',{'token':new_res.data.access})
                toast.success(res?.data?.message)
                dispatch(login({accessToken: new_res.data.access, refreshToken: new_res.data.refresh, username: data_res.data.username, first_name: data_res.data.first_name, last_name: data_res.data.last_name, role: data_res.data.role}))
                    
        } catch (err) {
            toast.warning(err?.response?.data?.message)
        }finally {
            setIsLoading(false);
          }
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
            const res = await API.post('/user/signin/', { identifire: formData.identifire, password: formData.password });

            const username = res.data.username
            const new_res = await API.post('token/',{ username:username, password:formData.password})
                
            const data_res = await API.post('user/token_data/',{'token':new_res.data.access})
            dispatch(login({accessToken: new_res.data.access, refreshToken: new_res.data.refresh, username: data_res.data.username, first_name: data_res.data.first_name, last_name: data_res.data.last_name, role: data_res.data.role}))
            toast.success(res?.data?.message)   
        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log(error);
            
            if (error?.response?.data?.email_varify){
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
        if (isAuthenticated) {
            switch (role) {
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
      }, [role, navigate, isAuthenticated]);


    const apiUrl = import.meta.env.VITE_API_URL;
    const navigateToGoogleLogin = () => {
        window.location.replace(`${apiUrl}user/auth/google/`); 
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
                            <GoogleLogin clientId={google_clint_id} onSuccess={responseGoogle} onFailure={responseGoogle} cookiePolicy={'single_host_origin'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn