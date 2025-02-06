
import './Users.css';
import chat_with_user from '../../assets/Admin_icones/Chat_to_user.png';
import { Ban, ArrowRepeat } from 'react-bootstrap-icons';
import API from '../../api';
import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../Admin';
import { Modal, Button, Form } from 'react-bootstrap'; 

const Users = () => {
  const [users, setUsers] = useState([]); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const { searchQuery } = useContext(SearchContext);
  const [sortedUsers, setSortedUsers] = useState([]); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [ tb_c, setTb_c ]=useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [formData, setFormData] = useState({ 'username':null, 'email':null, 'phone':null, 'first_name':null, 'last_name':null, 'password':null, 'cpassword':null, 'is_worker':null, });
  
  const restrict_user = async (id,index) => {
    try {
      const response = await API.post(`admin_view/restrict_user/`, { id });
      users[index].is_active = !users[index].is_active
      setTb_c(!tb_c)
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get('admin_view/view_users/');
        setUsers(res.data.Users);
        setSortedUsers(res.data.Users);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchData();
  }, [tb_c]);
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...sortedUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedUsers(sortedData);
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = sortedUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(sortedUsers);
    }
  }, [searchQuery, sortedUsers]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, sortedUsers.length);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleUsernameClick = (user) => {
    setCurrentUser(user); 
    setShowModal(true); 
  };

  const handleSave = async(user) => {

    try {
      let obj = true

      Object.entries(user).forEach(([feildname, feildvalue]) => {
        if (!feildvalue || feildvalue.toString().trim() == '') {
          if (feildname != 'is_worker'){
              toast.warning(`${feildname} is required`);
              obj = false
            }
            setShowCreateModal(false);
          }
        });
      if (obj) {
        const res = await API.post('admin_view/edit_user/',user);
        setTb_c(!tb_c)
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setShowModal(false);
  }

  const handleClose = () => {
    setShowModal(false); 
    setShowCreateModal(false);
  };

  const handleCreateUser = async() =>{
    let ok = true
    Object.entries(formData).forEach(([feildname, feildvalue]) => {
      if (!feildvalue || feildvalue.trim() === '') {
        if (feildname!='is_worker'){
          toast.warning(`${feildname} can't be empty`);
          ok = false
        }
      }
    });
    if (formData.password != formData.cpassword){
      toast.warning('passwords are not same')
      ok = false
      
    }
    try {
      if (ok){
        const res = await API.post('admin_view/create_user/',formData);
        setTb_c(!tb_c)
        setShowCreateModal(false)
        toast.success(res.data.message)
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <div>
      <div className="top_row">
        <h1>Users</h1>
        <button onClick={()=>setShowCreateModal(true)}> + Create new user </button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('id')}>
                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('username')}>
                USERNAME {sortConfig.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('email')}>
                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('phone')}>
                Phone {sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('date_joined')}>
                Created On {sortConfig.key === 'date_joined' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('last_login')}>
                Last Login {sortConfig.key === 'last_login' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('is_worker')}>
                Role {sortConfig.key === 'is_worker' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" className="action-th">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user,index) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td onClick={() => handleUsernameClick(user)}>
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.date_joined.substring(0, 10)}</td>
                <td>{user?.last_login?.substring(0, 10)}</td>
                <td>{user.is_worker ? `worker` : `Customer`}</td>
                <td className="action-td">
                  <img src={chat_with_user} alt="" />
                  {user.is_active?<Ban onClick={()=>{restrict_user(user.id,index)}}  color="red"/>:<ArrowRepeat onClick={()=>{restrict_user(user.id,index)}} color="green"/>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          {startIndex + 1}-{endIndex} of {sortedUsers.length}
        </span>&nbsp;&nbsp;&nbsp;
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='pagination-b'
        >
          &lt;
        </button>&nbsp;&nbsp;&nbsp;
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * rowsPerPage >= sortedUsers.length}
          className='pagination-b'
        >
          &gt;
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={currentUser.username} onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })} required readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} required readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="number" value={currentUser.phone} onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })} required readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" value={currentUser.first_name} onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })} required readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formUsername">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" value={currentUser.last_name} onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })} required readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control as="select" value={currentUser.is_worker ? 'worker' : 'customer'} onChange={(e) => setCurrentUser({ ...currentUser, is_worker: e.target.value === 'worker' })} >
                  <option value="worker">Worker</option>
                  <option value="customer">Customer</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={()=>handleSave({ 'id':currentUser.id, 'username':currentUser.username, 'email':currentUser.email, 'phone':currentUser.phone, 'first_name':currentUser.first_name, 'last_name':currentUser.last_name, 'is_worker':currentUser.is_worker })}> Save Changes </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Create new User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formFirstName">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formLastname">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formCPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" value={formData.cpassword} onChange={(e) => setFormData({ ...formData, cpassword: e.target.value })} required/>
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control as="select" value={formData.is_worker ? 'worker' : 'customer'} onChange={(e) => setFormData({ ...formData, is_worker: e.target.value === 'worker' })} >
                  <option value="worker">Worker</option>
                  <option value="customer">Customer</option>
                </Form.Control>
              </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button type='submit' variant="primary" onClick={handleCreateUser}> Create user </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
