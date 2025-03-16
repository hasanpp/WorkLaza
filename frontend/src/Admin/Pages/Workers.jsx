import './Workers.css';
import chat_with_user from '../../assets/Admin_icones/Chat_to_user.png';
import { Ban, ArrowRepeat, X } from 'react-bootstrap-icons';
import API from '../../api';
import { toast } from 'sonner';
import { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../Admin';
import { Modal, Button, Form } from 'react-bootstrap';
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest';
import { PageContext } from '../Admin'

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState();
  const [users, setUsers] = useState([])
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [sortedWorkers, setSortedWorkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [tb_c, setTb_c] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [formData, setFormData] = useState({});
  const setPage = useContext(PageContext);

  const restrict_worker = async (id, index) => {
    try {
      await secureRequest(async () => {
        const response = await API.patch(`/admin_view/workers_view/`, { id });
        workers[index].is_active = !workers[index].is_active
        setTb_c(!tb_c)
        toast.success(response.data.message);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await secureRequest(async () => {
          const res = await API.get('/admin_view/workers_view/');
          const j_res = await API.get('/admin_view/job_view/');
          setWorkers(res?.data?.workers);
          setJobs(j_res?.data?.Jobs)
          setSortedWorkers(res.data.workers);
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
    fetchData();
  }, [tb_c]);

  useEffect(() => {
    async function fetchData() {
      try {
        await secureRequest(async () => {
          const res = await API.get('/admin_view/users_view/');
          res?.data?.Users?.forEach((user) => { if (!user.is_worker) { setUsers(users => [...users, user]) } })
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
    fetchData();

  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...sortedWorkers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedWorkers(sortedData);
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = sortedWorkers?.filter(worker =>
        worker?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(sortedWorkers);
    }
  }, [searchQuery, sortedWorkers]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, sortedWorkers.length);
  const paginatedUsers = filteredWorkers.slice(startIndex, endIndex);

  const handleFullClick = (user) => {
    setCurrentWorker(user);
    setShowModal(true);
  };

  const handleSave = async (worker) => {

    try {
      let obj = true

      Object.entries(worker).forEach(([feildname, feildvalue]) => {
        if (!feildvalue || feildvalue.toString().trim() == '') {
          if (feildname != 'is_worker') {
            toast.warning(`${feildname} is required`);
            obj = false
          }
          setShowCreateModal(false);
        }
      });
      if (obj) {
        await secureRequest(async () => {
          const res = await API.put('/admin_view/workers_view/', worker);
          setTb_c(!tb_c)
          toast.success(res?.data?.message)
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setShowModal(false);
  }

  const handleClose = () => {
    setShowModal(false);
    setShowCreateModal(false);
  };

  const handleCreateWorker = async () => {
    let ok = true
    Object.entries(formData).forEach(([feildname, feildvalue]) => {
      if (!feildvalue || feildvalue.trim() === '') {
        if (feildname != 'is_worker') {
          toast.warning(`${feildname} can't be empty`);
          ok = false
        }
      }
    });
    try {
      if (ok) {
        await secureRequest(async () => {
          const res = await API.post('/admin_view/workers_view/', formData);
          setTb_c(!tb_c)
          setShowCreateModal(false)
          toast.success(res?.data?.message)
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  }
  const handleChatOpen = (userId) => {
    setPage(`Chats`); 
    localStorage.setItem('page', `Chats`);
    localStorage.setItem("chatReceiverId", userId); 
  };

  return (
    <div className="content-admin admin_workers_main">
      <div>
        <div className="top_row">
          <h1>Workes</h1>
          <button onClick={() => setShowCreateModal(true)}> + Create new worker </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" onClick={() => handleSort('id')}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('full_name')}>
                  FULL NAME {sortConfig.key === 'full_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('job')}>
                  JOB {sortConfig.key === 'job' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('salary')}>
                  Salary {sortConfig.key === 'salary' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('total_fee')}>
                  Total Charge{sortConfig.key === 'total_fee' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('payed_fee')}>
                  Payed Charge {sortConfig.key === 'payed_fee' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('pending_fee')}>
                  Pending Charge {sortConfig.key === 'pending_fee' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" className="action-th">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers?.map((worker, index) => (
                <tr key={index}>
                  <td>{worker?.id}</td>
                  <td onClick={() => handleFullClick(worker)}>{worker?.full_name}</td>
                  <td>{jobs?.map((job) => { return (job?.id == worker?.job && job?.title) })}</td>
                  <td>{worker?.salary}</td>
                  <td style={{ color: 'yellow' }}>{worker?.total_fee}</td>
                  <td style={{ color: 'green' }}>{worker?.payed_fee}</td>
                  <td style={{ color: 'red' }}>{worker?.pending_fee}</td>
                  <td className="action-td">
                    <img src={chat_with_user} alt="chat" onClick={()=>handleChatOpen(worker?.user)}/>
                    {worker.is_active ? <Ban onClick={() => { restrict_worker(worker.id, index) }} color="red" /> : <ArrowRepeat onClick={() => { restrict_worker(worker.id, index) }} color="green" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            {startIndex + 1}-{endIndex} of {sortedWorkers.length}
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
            disabled={currentPage * rowsPerPage >= sortedWorkers.length}
            className='pagination-b'
          >
            &gt;
          </button>
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>Worker Details</Modal.Title>
            <X onClick={handleClose} style={{ cursor: 'pointer', fontSize: '36px' }} />
          </Modal.Header>
          <Modal.Body>
            {currentWorker && (
              <Form>
                <Form.Group controlId="formUsername">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" value={currentWorker.full_name} onChange={(e) => setCurrentWorker({ ...currentWorker, full_name: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formTxt">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="text" value={currentWorker.age} onChange={(e) => setCurrentWorker({ ...currentWorker, age: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formTxt">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control type="text" value={currentWorker.salary} onChange={(e) => setCurrentWorker({ ...currentWorker, salary: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formTxt">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control type="text" value={currentWorker.qualification} onChange={(e) => setCurrentWorker({ ...currentWorker, qualification: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formTxt">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control type="text" value={currentWorker.experience} onChange={(e) => setCurrentWorker({ ...currentWorker, experience: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formTxt">
                  <Form.Label>JOB Category</Form.Label>
                  <Form.Control as="select" value={currentWorker.job} onChange={(e) => setCurrentWorker({ ...currentWorker, job: e.target.value })} >
                    {
                      jobs?.map((job, index) => {
                        return <option key={index} value={job.id} selected={currentWorker.job === job.id}>{job.title}</option>
                      })
                    }
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTxt">
                  <Form.Label>Previous Company</Form.Label>
                  <Form.Control type="text" value={currentWorker.previous_company} onChange={(e) => setCurrentWorker({ ...currentWorker, previous_company: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formdeS">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" value={currentWorker.description} rows={4} onChange={(e) => setCurrentWorker({ ...currentWorker, description: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formImages" style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                  {currentWorker?.certificate &&
                    <Form.Group controlId="formCertificate" style={{ width: '48%', height: 'auto' }}>
                      <Form.Label>Certificate</Form.Label><br />
                      <img src={`${currentWorker.certificate}`} alt="Worker" style={{ width: '100%', height: 'auto', }} />
                    </Form.Group>}
                  {currentWorker?.id_prof &&
                    <Form.Group controlId="formId_prof" style={{ width: '48%', height: 'auto' }}>
                      <Form.Label>Id proff</Form.Label><br />
                      <img src={`${currentWorker.id_prof}`} alt="Worker" style={{ width: '100%', height: 'auto', }} />
                    </Form.Group>
                  }

                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={() => handleSave({ 'id': currentWorker.id, 'previous_company': currentWorker.previous_company, 'job': currentWorker.job, 'full_name': currentWorker.full_name, 'age': currentWorker.age, 'salary': currentWorker.salary, 'description': currentWorker.description, 'qualification': currentWorker.qualification, 'experience': currentWorker.experience })}>Save Changes </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCreateModal} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>Create new Worker</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="half_grop" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="text" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="half_grop" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control type="text" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} required />
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="half_grop" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Form.Group controlId="formEmail">
                  <Form.Label>experience</Form.Label>
                  <Form.Control type="text" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formRole" style={{ width: '44%' }}>
                  <Form.Label>JOB Category</Form.Label>
                  <Form.Control as="select" value={formData.job} onChange={(e) => setFormData({ ...formData, job: e.target.value })} >
                    {
                      jobs?.map((job, index) => {
                        return (job?.is_active ? <option key={index} value={job.id} selected={formData.job === job.id}>{job.title}</option> : null)
                      })
                    }
                  </Form.Control>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="half_grop" style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Previous Company</Form.Label>
                  <Form.Control type="text" value={formData.previous_company} onChange={(e) => setFormData({ ...formData, previous_company: e.target.value })} required />
                </Form.Group>
                <Form.Group controlId="formRole" style={{ width: '44%' }}>
                  <Form.Label>User</Form.Label>
                  <Form.Control as="select" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} >
                    {
                      users.map((user, index) => {
                        return <option key={index} value={user.id}>{user.username}</option>
                      })
                    }
                  </Form.Control>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="formdeS">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={formData.description} rows={4} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button type='submit' variant="primary" onClick={handleCreateWorker}> Create Worker </Button>
          </Modal.Footer>
        </Modal>
      </div >
    </div>

  );
};

export default Workers
