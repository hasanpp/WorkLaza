/* eslint-disable no-unused-vars */
import './Profile.css';
import user_icone from '../../assets/user.png'
import React, { useEffect, useState, useRef  } from 'react';
import { toast } from 'react-toastify';
import API from '../../api';
import { Modal, Button } from "react-bootstrap";
import { X } from 'react-bootstrap-icons'
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authstate';

const Profile = () => {

  const [user, setUser] = useState();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [iscroped,setIscroped] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const cropperRef = useRef(null);


  const get_user_details =  async() =>{
    try {
      const res = await API.post('user/view_profile/',{'username':localStorage.getItem('Username')})
      setUser(res.data.user)
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(()=>{
    get_user_details()
  },[])

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

    try {
      const formData = new FormData();
      formData.append("profile_picture", dataURLtoFile(croppedImage, "profile.jpg"));
      formData.append('username' , localStorage.getItem('Username'))

      const res = await API.post("user/upload_profile_picture/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      setShow(false);
      setUser((prev) => ({ ...prev, profile_picture: res.data.profile_picture }));
    } catch (error) {
      console.log(error.response);
      
      toast.error("Failed to update profile picture.");
    }
  };

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

  return (
    <div>
        <br /><br /><br />
        <div className="container-fluid">
            <span>Profile</span>
            <div className="row profile-details">
                <div className="col-lg-6 col-md-4 col-sm-12 left-img">
                  <br />
                  <img src={ user?.profile_picture &&`http://localhost:8000/${user.profile_picture}` || user?.profile_picture_g&&user.le_picture_g || user_icone } alt=""/><br/>
                  <button onClick={() => setShow(true)}>Add/Change image</button>
                  <br />
                </div>
                <div className="col-lg-6 col-md-8 col-sm-12 right-details">
                  <br />
                  <h1 style={{textAlign:'center'}}>{`${user?.first_name} ${user?.last_name}`}</h1>
                  <div className="details">
                    <span>Email : {user?.email}</span>
                    <span>Username : {user?.username}</span>
                    <span>Phone : {user?.phone}</span>
                    <span>First Name : {user?.first_name}</span>
                    <span>Last Name : {user?.last_name}</span>
                  </div>
                  <button onClick={async()=>{ await logout(), navigate('/Forgot')}}>Change Password</button>
                </div>
            </div>
        </div>
        <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header >
          <Modal.Title>Upload Profile Picture</Modal.Title>
          <X onClick={() => setShow(false)} style={{ fontSize: '40px'}}/>
        </Modal.Header>
        <Modal.Body>
          {image ? (
            <>
              {iscroped ?
                <>
                  <img src={croppedImage} alt="" style={{width:'90%',marginLeft:'25px',}}/>
                </>
                :<>
                  <Cropper ref={cropperRef} src={image} style={{ height: 300, width: "100%" }} aspectRatio={1} guides={false} />
                  <Button variant="primary" onClick={cropImage} className="mt-2"> Crop Image </Button>
                </>
              }
            </>
          ) : (
            <label className="upload-label" style={{cursor:'pointer'}}>
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
      <br /><br />
    </div>
  )
}

export default Profile
