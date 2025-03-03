/* eslint-disable no-unused-vars */

import './Profile.css'
import "cropperjs/dist/cropper.css";
import user_icone from '../../../assets/user.png'
import { useEffect, useState, useRef, useContext } from 'react';
import { toast } from 'sonner';
import API from '../../../api';
import { Modal, Button, Form } from "react-bootstrap";
import { X, PencilSquare,CloudUpload } from 'react-bootstrap-icons'
import { Cropper } from "react-cropper";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../authSlice';
import { getAddressFromCoordinates,getGeolocation } from '../../../Compenets/Address/GetAddress'
import { LoadingContext } from '../../../App';


const Profile = () => {

  const [user, setUser] = useState();
  const [worker, setWorker] = useState();
  const [address, setAddress] = useState();
  const [formEditData, setFormEditData] = useState(null);
  const [profetionalFormData, setProfetionalFormData] = useState(null);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [iscroped, setIscroped] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cropperRef = useRef(null);
  const [certificate, setCertificate] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [tb, setTb] = useState(false);
  const setIsLoading = useContext(LoadingContext)

  const get_user_details = async () => {
    setIsLoading(true)
    try {
      const res = await API.get('/user/view_profile/')
      setUser(res.data.user)
      setFormEditData({ first_name: res.data.user.first_name, last_name: res.data.user.last_name, phone: res.data.user.phone, username: res.data.user.username })
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally{
      setIsLoading(false)
    }
  }
  
  const get_worker_details = async () => {
    setIsLoading(true)
    try {
      const res = await API.get('/worker/view_details/')
      setWorker(res.data.worker)
      let address = await getAddressFromCoordinates(res.data.worker.latitude,res.data.worker.longitude)
      setAddress(address)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    get_user_details()
    get_worker_details()
  }, [tb])

  const apiUrl = import.meta.env.VITE_API_URL;


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    if (cropperRef.current) {
      setIscroped(true)
      setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    }
  };

  const handleSave = async () => {
    if (!croppedImage) {
      toast.error("Please crop the image before saving.");
      return;
    }
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("profile_picture", dataURLtoFile(croppedImage, "profile.jpg"));

      const res = await API.post("/user/upload_profile_picture/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      setShow(false);
      setUser((prev) => ({ ...prev, profile_picture: res.data.profile_picture }));
    } catch (error) {
      console.log(error.response);

      toast.error("Failed to update profile picture.");
    } finally {
      setIsLoading(false)
    }
  };

  const handleEditProfile = async () => {
    setIsLoading(true)
    try {
      const res = await API.post("/user/edit_details/", formEditData);

      toast.success(res?.data?.message)
      setShowEdit(false)
      setTb(!tb)
    } catch (err) {
      toast.warning(err?.response?.data?.message)
    } finally{
      setIsLoading(false)
    }
  }
  
  const handleChangeLocation = async (e) =>{
    e.preventDefault()
    setIsLoading(true)
    try {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition( async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setWorker({ ...worker,latitude:latitude,longitude:longitude})
            let address = await getAddressFromCoordinates( latitude, longitude)
            setAddress(address)
          },
          (error) => {
            toast.error("Error getting geolocation:", error);
          }
        );
      } else {
          toast.err("Geolocation is not supported by this browser.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSaveworker = async(e) =>{
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await API.post('/worker/edit_details/',worker)

      toast.success(res?.data?.message)
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }


  return (
    <div className='main_class_pro'>
      <div className="container-fluid">
        <span className='page_name'>Profile </span>
        <br /><br />
        <div className="row profile-details">
          <div className="col-lg-6 col-md-6 col-sm-12 left-img">
            <br />
            <h1 style={{ textAlign: 'center' }} className='phone_user_name'>{`${user?.first_name} ${user?.last_name}`}</h1>
            <br />
            <img src={user?.profile_picture && `${apiUrl}${user.profile_picture}` || user?.profile_picture_g && user.le_picture_g || user_icone} alt="" /><br />
            <button onClick={() => setShow(true)}>Add/Change image</button>
            <br />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 right-details">
            <br />
            <h1 style={{ textAlign: 'center' }}>{`${user?.first_name} ${user?.last_name}`}</h1>
            <div className="details">
              <span className='edit' onClick={() => setShowEdit(true)}><PencilSquare /></span>
              <span>Email : {user?.email} </span>
              <span>Username : {user?.username}</span>
              <span>Phone : {user?.phone}</span>
              <span>First Name : {user?.first_name}</span>
              <span>Last Name : {user?.last_name}</span>
            </div>
            <button onClick={async () => { await dispatch(logout()), navigate('/Forgot') }}>Change Password</button>
          </div>
        </div>
      </div>
      <br /><br />
      <div className="container-fluid Profetional_details">
        <br /><br />
        <form action="" className="profetional_details_form col  col-md-12 col-lg-12 col-sm-12 row">
          <div className="left_details col-md-5 col-lg-5 col-sm-12">
            <h2>Professional details</h2>
            <hr /><br />
            <div className="form-group">
              <label htmlFor="full_name" className="label">Full name</label>
              <input type="text" className="form-input" id="full_name" required  value={worker?.full_name} onChange={(e)=>setWorker({ ...worker, full_name: e.target.value})}/>
            </div>
            <div className="half-input">
              <div className="form-group">
                <label htmlFor="age" className="label">Age</label>
                <input type="number" className="form-input" id="age" required  value={worker?.age} onChange={(e)=>setWorker({ ...worker, age: e.target.value})}/>
              </div>
              <div className="form-group">
                <label htmlFor="salary" className="label">Price per hour</label>
                <input type="number" maxLength={4} className="form-input" id="salary" required  value={worker?.salary} onChange={(e)=>setWorker({ ...worker, salary: e.target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="qualification" className="label">Educational qualification</label>
              <input type="text" className="form-input" id="qualification" required  value={worker?.qualification} onChange={(e)=>setWorker({ ...worker, qualification: e.target.value})}/>
            </div>
            <div className="half-input">
              <div className="form-group">
                <label htmlFor="experience" className="label">No years of experience</label>
                <input type="number" className="form-input" id="experience" required value={worker?.experience} onChange={(e)=>setWorker({ ...worker, experience: e.target.value})}/>
              </div>
              <div className="form-group">
                <label htmlFor="previous_company" className="label">Previous company (if any)</label>
                <input type="text" className="form-input" id="previous_company" required  value={worker?.previous_company} onChange={(e)=>setWorker({ ...worker, previous_company: e.target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="job" className="label">Job title</label>
              <select name="" id="job" className="form-input job_select"  required  disabled={true}>
                <option  className='job_obtions'>{worker?.job}</option>
              </select>
            </div>
          </div>
          <div className="right_details col-md-5 col-lg-5 col-sm-12">
            <div className="form-group des">
              <label htmlFor="description" className="label">Tell us about yourself</label>
              <textarea name="description" className="inp_des form-input" id="description" value={worker?.description} style={{backgroundColor:'transparent',height:'200px'}} onChange={(e)=>setWorker({ ...worker, description: e.target.value})}></textarea>
            </div>
            <div className="form-group des">
              <label htmlFor="description" className="label">Location</label>
              <textarea name="description" className="inp_des form-input" id="description"  style={{backgroundColor:'transparent',height:'100px'}} value={address} disabled={true}></textarea>
            </div>
            <div className="form-group last_buttons">
              <br />
              <button className='ch_location' onClick={handleChangeLocation}>Change location to here</button>
              <br /><br />
              <button className='save_details' onClick={handleSaveworker}>Save details</button>
            </div>
          </div>
        </form>
        <br /><br />
      </div>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header >
          <Modal.Title>Upload Profile Picture</Modal.Title>
          <X onClick={() => setShow(false)} style={{ fontSize: '40px' }} />
        </Modal.Header>
        <Modal.Body>
          {image ? (
            <>
              {iscroped ?
                <>
                  <img src={croppedImage} alt="" style={{ width: '90%', marginLeft: '25px', }} />
                </>
                : <>
                  <Cropper ref={cropperRef} src={image} style={{ height: 300, width: "100%" }} aspectRatio={1} guides={false} />
                  <Button variant="primary" onClick={cropImage} className="mt-2"> Crop Image </Button>
                </>
              }
            </>
          ) : (
            <label className="upload-label" style={{ cursor: 'pointer' }}>
              Click to upload a profile picture
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}> Cancel </Button>
          <Button variant="success" onClick={handleSave}> Save </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header >
          <Modal.Title>Edit Profile Details</Modal.Title>
          <X onClick={() => setShowEdit(false)} style={{ fontSize: '40px' }} cursor={'pointer'} />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={formEditData?.username} onChange={(e) => setFormEditData({ ...formEditData, username: e.target.value.trim().replace(" ", "") })} required />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={formEditData?.first_name} onChange={(e) => setFormEditData({ ...formEditData, first_name: e.target.value })} required />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={formEditData?.last_name} onChange={(e) => setFormEditData({ ...formEditData, last_name: e.target.value })} required />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={formEditData?.phone} onChange={(e) => setFormEditData({ ...formEditData, phone: e.target.value.trim().replace(" ", "") })} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}> Cancel </Button>
          <Button variant="success" onClick={handleEditProfile}> Save </Button>
        </Modal.Footer>
      </Modal>
      <br /><br />
    </div>
  )
}

export default Profile
