/* eslint-disable no-unused-vars */
import './Wallet.css';
import { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../Admin';
import API from '../../api';
import { toast } from 'sonner';
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest';


const Wallet = () => {
  const [wallet, setWallet] = useState();
  const [balence, setBalence] = useState();
  const [filteredWallet, setFilteredWallet] = useState();
  const { searchQuery } = useContext(SearchContext);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;


  useEffect(() => {
    async function fetchData() {
      try {
        await secureRequest(async () => {
          const res = await API.get('/admin_view/view_wallet/');
          console.log(res?.data?.Wallet)
          setWallet(res?.data?.Wallet);
          setBalence(res?.data?.balence);
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
    fetchData();
  }, []);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = wallet?.filter(wallet =>
        wallet?.amount?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        wallet?.pyment_id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        wallet?.status?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        wallet?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
      setFilteredWallet(filtered);
    } else {
      setFilteredWallet(wallet);
    }
  }, [searchQuery, wallet]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, wallet?.length);
  const paginatedWallet = filteredWallet?.slice(startIndex, endIndex);


  return (
    <div className="content-admin admin_wallet_main">
      <div>
        <div className="top_row">
          <h1>Wallet</h1>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" >PAYMENT ID</th>
                <th scope="col" >WORKER</th>
                <th scope="col" >AMOUNT</th>
                <th scope="col" >TYPE</th>
                <th scope="col" >STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWallet?.map((wall, index) => (
                <tr key={index}>
                  <td>{wall?.pyment_id}</td>
                  <td>{wall?.worker_profile?.full_name}</td>
                  <td>₹ {wall?.amount / 100}</td>
                  <td>{wall?.type}</td>
                  <td>{wall?.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h4 className='balence-h4' style={{ textAlign: 'end', margin: " 0% 4% 1% 0%" }}>Balnce : ₹ <span>{balence}</span></h4>
        <div className="pagination">
          <span>
            {startIndex + 1}-{endIndex} of {wallet?.length}
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
            disabled={currentPage * rowsPerPage >= wallet?.length}
            className='pagination-b'
          >
            &gt;
          </button>
        </div>
      </div>
    </div>

  )
}

export default Wallet
