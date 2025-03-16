/* eslint-disable no-unused-vars */
import './Categoryes.css';
import { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../Admin';
import { LoadingContext } from '../../App';
import API from '../../api';
import { toast } from 'sonner';
import { Modal, Button, Form } from 'react-bootstrap';
import { Ban, ArrowRepeat, X } from 'react-bootstrap-icons';
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest';


const Categoryes = () => {
  const [jobs, setJobs] = useState();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [sortedJobs, setSortedJobs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [tb_c, setTb_c] = useState(false);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const setIsLoading = useContext(LoadingContext);


  useEffect(() => {
    async function fetchData() {
      try {
        await secureRequest(async () => {
          const res = await API.get('/admin_view/job_view/');
          setJobs(res.data.Jobs);
          setSortedJobs(res.data.Jobs);
        });
      } catch (error) {
        error?.response?.data?.message && toast.error(error?.response?.data?.message)
      }
    }
    fetchData();
  }, [tb_c]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...sortedJobs].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedJobs(sortedData);
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = sortedJobs?.filter(job =>
        job?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        job?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(sortedJobs);
    }
  }, [searchQuery, sortedJobs, tb_c]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, sortedJobs?.length);
  const paginatedJobs = filteredJobs?.slice(startIndex, endIndex);

  const handleTitleClick = (job, index) => {
    setCurrentJob({ ...job, 'index': index });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setShowModal(false)
  };

  const handleCreateJob = async () => {
    try {
      await secureRequest(async () => {
        const res = await API.post('/admin_view/job_view/', formData)
        console.log(res.data)
        setShowCreateModal(false)
        toast.success(res?.data?.message)
      });
    } catch (err) {
      err?.response?.data?.message && toast.error(err?.response?.data?.message)
    }
  };

  const handleSaveJob = async () => {
    try {
      await secureRequest(async () => {

        const res = await API.put('/admin_view/job_view/', currentJob)
        console.log(res.data)
        setShowModal(false)
        toast.success(res?.data?.message)
      });
    } catch (err) {
      err?.response?.data?.message && toast.error(err?.response?.data?.message)
    }
  };

  const handleRestrictJob = async (id, index) => {
    try {
      await secureRequest(async () => {

        const res = await API.patch('/admin_view/job_view/', { 'id': id })
        jobs[index].is_active = !jobs[index].is_active
        setShowCreateModal(false)
        setTb_c(!tb_c)
        toast.success(res?.data?.message)
      });
    } catch (err) {
      err?.response?.data?.message && toast.error(err?.response?.data?.message)
    }
  };


  return (
    <div className="catogreyes-admin-main content-admin">
      <div>
        <div className="top_row">
          <h1>JOB Categores</h1>
          <button onClick={() => setShowCreateModal(true)}> + Create new JOB </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" onClick={() => handleSort('id')}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('title')}>
                  JOB TITLE {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => handleSort('description')}>
                  DESCRIPTION {sortConfig.key === 'description' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" className="action-th">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs?.map((job, index) => (
                <tr key={index}>
                  <td>{job.id}</td>
                  <td onClick={() => handleTitleClick(job, index)}>
                    {job.title}
                  </td>
                  <td>{job.description}</td>
                  <td className="action-td" style={{ justifyContent: "center" }}>
                    <button onClick={() => { handleRestrictJob(job.id, index) }}>{job?.is_active ? <Ban color="red" size={11} /> : <ArrowRepeat color="green" size={11} />}</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            {startIndex + 1}-{endIndex} of {sortedJobs?.length}
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
            disabled={currentPage * rowsPerPage >= sortedJobs?.length}
            className='pagination-b'
          >
            &gt;
          </button>
        </div>
        <Modal show={showCreateModal} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>Create new JOB Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>JOB Title</Form.Label>
                <Form.Control type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </Form.Group>
              <Form.Group controlId="formdeS">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={formData.description} rows={4} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button type='submit' variant="primary" onClick={handleCreateJob}> Create JOB </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title>Inspect JOB Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>JOB Title</Form.Label>
                <Form.Control type="text" value={currentJob?.title} onChange={(e) => setCurrentJob({ ...formData, title: e.target.value })} required />
              </Form.Group>
              <Form.Group controlId="formdeS">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={currentJob?.description} rows={4} onChange={(e) => setCurrentJob({ ...formData, description: e.target.value })} required />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button type='submit' variant="primary" onClick={handleSaveJob}> Save JOB </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>

  )
}

export default Categoryes
