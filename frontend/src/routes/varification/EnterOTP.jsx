import { useState, useEffect, useContext } from 'react';
import API from '../../api';
import {useNavigate} from 'react-router-dom';
import logo from '../../assets/logo.png';
import './EnterOTP.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingContext } from '../../App';
import { useSelector } from 'react-redux';
const EnterOTP = () => {


    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth)
    const setIsLoading = useContext(LoadingContext);



    useEffect(() => {
        const timer = setInterval(() => {
          setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
      }, []);

    const handleResend = async (e) => {
        e.preventDefault()
        try {
         const res= await API.post('/user/sendotp/', { email:localStorage.getItem('email') });
         console.log(res);
         
            toast.success('OTP resent successfully!');
            setResendTimer(60); 
        } catch (err) {
            console.log(err);
            
            toast.error('Failed to resend OTP.');
        }
      };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await API.post('/user/verifyotp/', { email:localStorage.getItem('email'), otp:otp });

          if (response.status === 200) {
            toast.success('OTP verified successfully!');
            
            if (localStorage.getItem('forgot_password')){
                navigate('/change_password')
            }
            else {
                toast.success('Email varification complted please signin with your email')
                navigate('/singin'); 
            }
            
          }
        } catch (err) {
            console.log(err);
            
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
          }
    };

    if (isAuthenticated) {
        navigate('/');
        return null;
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
                        <h2>Verify it’s you</h2>
                        <hr />
                        <br /><br />
                        <span>{`OTP will expire with in ${resendTimer} seconds`}</span>
                        <form>
                            <div className="form-group">
                                <br /><br />
                                <label htmlFor="otp" className='label'>Enter the OTP send to your email</label>
                                <input type="text" className="form-input" id="otp" value={otp} onChange={(e)=>setOtp(e.target.value)} maxLength={6} />
                            </div>
                            <br />
                            <hr />
                            <br />
                            <button type="submit" className="form_submit_btn" onClick={handleVerify} disabled={resendTimer == 0}>Verify OTP</button>
                            <br />
                            <button type="submit" className="form_submit_btn" onClick={handleResend} disabled={resendTimer > 0 }>Resend OTP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnterOTP;
