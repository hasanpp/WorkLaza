/* eslint-disable no-unused-vars */
import { useState, useContext } from 'react';
import API from '../../api';
import {useNavigate} from 'react-router-dom';
import logo from '../../assets/logo.png';
import './EnterOTP.css';
import { toast } from 'sonner';
import { LoadingContext } from '../../App';
import {useSelector } from 'react-redux';



const Forgot = () => {

    
    const [identifire, setIdentifire] = useState();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth)
    const setIsLoading = useContext(LoadingContext);


    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const get_email = await  API.patch('/user/featch_user_data/', { identifire: identifire,});  
            const res= await API.post('/user/otp_view/', { email:get_email.data.email });
            localStorage.setItem('email', get_email.data.email);
            localStorage.setItem('forgot_password', true);

            navigate('/signup/enterotp');

            
        } catch (err) {
            console.log(err.response.data);
            
            toast.error('Invalid identifire. Please try again.');
        } finally {
            setIsLoading(false);
          }
    }

    if (isAuthenticated) {
        navigate('/');
        return null;
      }
    return (
        <div className="container">
            <div className="row">
                
                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid form-div">
                    <div className="sign_form">
                        <h2>Forgot Password ?</h2>
                        <hr />
                        <br /><br />
                        <form>
                            <div className="form-group">
                                <br /><br />
                                <label htmlFor="otp" className='label'>Username or email or phone</label>
                                <input type="text" className="form-input" id="identifire" value={identifire} required onChange={(e)=>setIdentifire(e.target.value)}/>
                            </div>
                            <br />
                            <br />
                            <hr />
                            <br />
                            <br />
                            <button type="submit" className="form_submit_btn" onClick={handleSubmit} >Sent OTP</button>
                            <br />
                            <br />
                        </form>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid logo-class">
                    <img src={logo} alt="" />
                    <h1>Work Laza</h1>
                    <span>{`"Where Works Meet Solution !"`}</span>
                </div>
            </div>
        </div>
    )
}
export default Forgot;
