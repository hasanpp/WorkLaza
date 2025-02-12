/* eslint-disable no-unused-vars */
import './Profile.css';
import user_icone from '../../assets/user.png'
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import API from '../../api';
import { Modal, Button, Form } from "react-bootstrap";
import { X, PencilSquare } from 'react-bootstrap-icons'
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../authSlice';
const Profile = () => {

  const [user, setUser] = useState();
  const [formEditData, setFormEditData] = useState(null);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [iscroped, setIscroped] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cropperRef = useRef(null);
  const [tb , setTb] = useState(false);


  const get_user_details = async () => {

    try {
      const res = await API.get('user/view_profile/')
      setUser(res.data.user)
      setFormEditData({ first_name:res.data.user.first_name, last_name:res.data.user.last_name, phone:res.data.user.phone, username:res.data.user.username})
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    get_user_details()
  }, [tb])

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

  const handleEditProfile= async () => {
    try {
      const res = await API.post("user/edit_details/",formEditData);

      toast.success(res?.data?.message)
      setShowEdit(false)
      setTb(!tb)
    } catch (err) {
      toast.warning(err?.response?.data?.message)
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

  return (
    <div>
      <br /><br /><br />
      <div className="container-fluid">
        <br />
        <span className='page_name'>Profile</span>
        <br />
        <div className="row profile-details">
          <div className="col-lg-6 col-md-6 col-sm-12 left-img">
            <br />
            <h1 style={{ textAlign: 'center' }} className='phone_user_name'>{`${user?.first_name} ${user?.last_name}`}</h1>
            <br />
            <img src={user?.profile_picture && `http://localhost:8000/${user.profile_picture}` || user?.profile_picture_g && user.le_picture_g || user_icone} alt="" /><br />
            <button onClick={() => setShow(true)}>Add/Change image</button>
            <br />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 right-details">
            <br />
            <h1 style={{ textAlign: 'center' }}>{`${user?.first_name} ${user?.last_name}`}</h1>
            <div className="details">
              <span className='edit' onClick={()=> setShowEdit(true)}><PencilSquare /></span>
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
          <X onClick={() => setShowEdit(false)} style={{ fontSize: '40px' }} cursor={'pointer'}/>
        </Modal.Header>
        <Modal.Body>
        <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={formEditData?.username} onChange={(e) => setFormEditData({ ...formEditData, username: e.target.value.trim().replace(" ","") })} required/>
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" value={formEditData?.first_name} onChange={(e) => setFormEditData({ ...formEditData, first_name: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" value={formEditData?.last_name} onChange={(e) => setFormEditData({ ...formEditData, last_name: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" value={formEditData?.phone} onChange={(e) => setFormEditData({ ...formEditData, phone: e.target.value.trim().replace(" ","") })} required/>
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
