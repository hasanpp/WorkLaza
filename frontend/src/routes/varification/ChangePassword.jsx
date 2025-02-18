import { LoadingContext } from '../../App';
import { useContext, useState, useEffect } from 'react';
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify';
import API from '../../api';
import { useDispatch,useSelector } from 'react-redux';
import { login } from '../../authSlice';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {

    const setIsLoading = useContext(LoadingContext);
    const [password,setPassword] = useState('');
    const [cpassword,setCpassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth)

    const handleSubmit = async(e) =>{

        e.preventDefault();
        
        if (password != cpassword){
            toast.warning('passwords should be same')
        }
        else {
            setIsLoading(true);
            try{
                const res = await API.post('/user/change_password/', { email:localStorage.getItem('email'), password:password });
                const username = res.data.username
                const new_res = await API.post('token/',{ username:username, password:password})

                const data_res = await API.post('user/token_data/',{'token':new_res.data.access})
                toast.success('Password changed successfully');
                dispatch(login({accessToken: new_res.data.access, refreshToken: new_res.data.refresh, username: data_res.username, first_name: data_res.first_name, last_name: data_res.last_name, role: data_res.role}))
            }
            catch(err) {
                toast(err.response.data.message)
            }
            finally{
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
            if (isAuthenticated) {
                navigate('/');
            }
    }, [navigate, isAuthenticated]);

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
                                <input type="password" className="form-input" id="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                                <br />
                                <label htmlFor="cpassword" className='label'>Confirm password</label>
                                <input type="password" className="form-input" id="cpassword" value={cpassword} required onChange={(e) => setCpassword(e.target.value)} />
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
