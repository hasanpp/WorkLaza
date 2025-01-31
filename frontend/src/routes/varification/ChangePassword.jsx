import { LoadingContext } from '../../App';
import { useContext, useState } from 'react';
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify';
import API from '../../api';
import { useNavigate } from 'react-router-dom';



const ChangePassword = () => {

    const setIsLoading = useContext(LoadingContext);
    const [password,setPassword] = useState('');
    const [cpassword,setCpassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{

        e.preventDefault();
        
        if (password != cpassword){
            toast.warning('passwords should be same')
        }
        else {
            setIsLoading(true);
            try{
                await API.post('/user/change_password/', { email:localStorage.getItem('email'), password:password });
                toast.success('Password changed please relogin');
                navigate('/signin')
            }
            catch(err) {
                toast(err.response.data.message)
            }
            finally{
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="container">
            <div className="row">

                <div className="col-lg-6 col-md-12 col-12 col-sm-12 cols-grid form-div">
                    <div className="sign_form">
                        <h2>Create a new Password ?</h2>
                        <hr />
                        <form>
                            <div className="form-group">
                                <br /><br />
                                <label htmlFor="password" className='label'>New password</label>
                                <input type="text" className="form-input" id="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                                <br />
                                <label htmlFor="cpassword" className='label'>Confirm password</label>
                                <input type="text" className="form-input" id="cpassword" value={cpassword} required onChange={(e) => setCpassword(e.target.value)} />
                            </div>
                            <br />
                            <hr />
                            <br />
                            <br />
                            <button type="submit" className="form_submit_btn" onClick={handleSubmit} >Confirm password</button>
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

export default ChangePassword
