import { useState, useEffect, useRef, useContext } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './EnterOTP.css';
import { toast } from 'sonner';
import { LoadingContext } from '../../App';
import { verifyOtp } from '../../otpSlice';
import { useSelector, useDispatch } from 'react-redux';

const EnterOTP = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const [resendTimer, setResendTimer] = useState(180);
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const setIsLoading = useContext(LoadingContext);
    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.otp.userEmail);


    useEffect(() => {
        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Allow only numbers

        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const otpValue = otp.join("");
            console.log(otpValue)
            const response = await API.patch('/user/otp_view/', {
                email: userEmail,
                otp: otpValue
            });

            if (response.status === 200) {
                toast.success("OTP verified successfully!");
                if (localStorage.getItem('forgot_password')) {
                    localStorage.removeItem('forgot_password')
                    dispatch(verifyOtp());
                    navigate('/change_password');
                } else {
                    toast.success("Email verification completed, please sign in.");
                    navigate('/signin');
                }
            }
        } catch (err) {
            console.log(err);
            setOtp(["", "", "", "", "", ""]); // Clear OTP on failure
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await API.post('/user/otp_view/', { email: userEmail });
            toast.success("OTP resent successfully!");
            setResendTimer(180);
        } catch (err) {
            console.log(err);
            toast.error("Failed to resend OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [navigate, isAuthenticated, ]);

    return (
        <div className="container enter-otp-main">
            <div className="row otp-varificatio-row">
                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid logo-class">
                    <img src={logo} alt="Logo" />
                    <h1>Work Laza</h1>
                    <span>{`"Where Works Meet Solution!"`}</span>
                </div>
                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid form-div">
                    <br /><br /><br /><br />
                    <div className="sign_form">
                        <h2>Verify it’s you</h2>
                        <hr />
                        <span>OTP will expire in {resendTimer} seconds</span>
                        <form>
                            <div className="otp-input-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="otp-input-colum"
                                    />
                                ))}
                            </div>
                            <button type="submit" className={`form_submit_btn ${resendTimer === 0 && "otp_dis"}`} onClick={handleVerify} disabled={resendTimer === 0}>
                                Verify OTP
                            </button><br /><br />
                            <button type="submit" className={`form_submit_btn ${resendTimer > 0 && "otp_dis"}`} onClick={handleResend} disabled={resendTimer > 0}>
                                Resend OTP
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterOTP;
