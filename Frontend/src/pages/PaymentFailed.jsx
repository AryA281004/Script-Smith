import React from 'react';
import { Link, useLocation ,useNavigate } from 'react-router-dom';
import { getcurrentUser } from '../api/api';
import { useDispatch } from 'react-redux';

const PaymentFailed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = new URLSearchParams(location.search);
    const orderId = location.state?.orderId || params.get('orderId') || null;
    const amount = location.state?.amount || params.get('amount') || null;


    React.useEffect(() => {
        // Fetch current user data to update credits if needed
        getcurrentUser(dispatch);
        const t = setTimeout(() => {
            navigate("/pricing");
        }, 10000);

        return () => clearTimeout(t);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center text-white p-6">
            <div className="max-w-xl w-full bg-white/5 backdrop-blur rounded-[50px] border border-white/20 p-8 text-center">
                <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-white/5 border border-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="ai-h2 text-2xl font-semibold mt-6">Payment Failed</h1>
                <p className="mt-2 text-sm text-red-100">Sorry, your payment failed. Please try again.</p>

                {amount && (
                    <p className="mt-3 text-sm text-red-50">Amount: <span className="font-semibold">{amount}</span></p>
                )}

                {orderId && (
                    <p className="mt-1 text-sm text-red-50">Order ID: <span className="font-mono">{orderId}</span></p>
                )}

                <div className="mt-6 flex justify-center gap-4">
                    <Link to="/" className="px-4 py-2 rounded bg-red-500 hover:bg-red-400 text-black font-medium">Go to Home</Link>
                    <Link to="/profile" className="px-4 py-2 rounded border border-red-300 text-red-100 hover:bg-white/5">View Orders</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;

