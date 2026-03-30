import React from 'react';
import { Link, useLocation ,useNavigate } from 'react-router-dom';
import { getcurrentUser } from '../api/api';
import { useDispatch } from 'react-redux';

const PaymentSuccess = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const orderId = location.state?.orderId || params.get('orderId') || null;
	const amount = location.state?.amount || params.get('amount') || null;

    const dispatch = useDispatch();
    const nevigate= useNavigate();

    React.useEffect(() => {
        // Fetch current user data to update credits if needed
        getcurrentUser(dispatch);
        const t = setTimeout(() => {
            nevigate("/authcomplete");
        }, 10000);

        return () => clearTimeout(t);
    }, []);

	return (
		<div className="min-h-screen flex items-center justify-center text-white p-6">
			<div className="max-w-xl w-full bg-white/5 backdrop-blur rounded-[50px] border border-white/20 p-8 text-center">
				<div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-white/5 border border-green-400">
					<svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>

				<h1 className="ai-h2 text-4xl font-semibold mt-6">Payment Successful</h1>
				<p className="mt-2 text-lg text-green-500/90">Thank you — your payment has been processed successfully.</p>

				{amount && (
					<p className="mt-3 text-sm text-green-50">Amount: <span className="font-semibold">{amount}</span></p>
				)}

				{orderId && (
					<p className="mt-1 text-sm text-green-50">Order ID: <span className="font-mono">{orderId}</span></p>
				)}

				<div className="mt-6 flex justify-center gap-4">
					<Link to="/authcomplete" className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white font-medium">Go to Home</Link>
					<Link to="/profile" className="px-4 py-2 rounded-lg border border-green-300 text-green-100 hover:bg-white/5">View Orders</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;

