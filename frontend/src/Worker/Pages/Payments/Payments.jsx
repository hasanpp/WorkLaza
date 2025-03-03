import { useEffect, useState, useContext } from 'react'
import './Payments.css'
import secureRequest from '../../../Compenets/ProtectedRoute/secureRequest';
import { toast } from 'sonner';
import API from '../../../api';
import { LoadingContext } from '../../../App';


const Payments = () => {

    const [workerData, setWrokerData] = useState();
    const [walletData, setWalletData] = useState();
    const setIsLoading = useContext(LoadingContext);

    const fetchData = async () => {
        try {
            await secureRequest(async () => {
                const res = await API.get('/worker/payment_view')
                setWrokerData(res?.data?.worker)
                setWalletData(res?.data?.wallet_rows)
            });
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }

    }

    useEffect(() => {
        fetchData();
    }, [])

    const handlePayment = async () => {
        setIsLoading(true)
        try {
            const res = await API.post("/worker/create-checkout-session/");
            window.location.href = res.data.checkout_url;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Payment failed");
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className='payments_div'>
            <span>Payments</span>
            <br /><br />
            <div className="top_row">
                <h2>Pending Payment Total : <span>₹ {workerData?.pending_fee}</span></h2>
                <button onClick={handlePayment} >Complete pending payment now</button>
            </div>
            <br /> <hr /> <br />

            <h1>Transaction history</h1>

            <div className="table-container " >
                <table className="table">
                    {walletData?.length == 0 ?
                        <h3 style={{ padding: "5% 5%", color: 'red' }}>Please Complete at least one payment</h3>
                        :
                        <>
                            <thead>
                                <tr>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Payment Id</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    walletData?.map((row,index) => (
                                        <tr key={index}>
                                            <td>₹ {row?.amount/100}</td>
                                            <td>{row?.pyment_id}</td>
                                            <td>{row?.status}</td>
                                            <td>{row?.type === "credit" ?"debit" :"credit"}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </>
                    }
                </table>
                <br />
            </div>
        </div>
    )
}

export default Payments


