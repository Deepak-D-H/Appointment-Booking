import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../config';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(Boolean(sessionId));
  const [verifiedBooking, setVerifiedBooking] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const verifyCheckout = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/v1/bookings/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (isMounted) {
          if (res.ok && data.success) {
            setVerifiedBooking(data.data);
            setStatusMessage('Your payment has been verified and your appointment is confirmed!');
          } else {
            setStatusMessage('Your payment was received. Appointment status will update shortly.');
          }
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        if (isMounted) {
          setStatusMessage('Payment completed. Your appointment is being processed.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (sessionId) {
      verifyCheckout();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <div className='bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center'>
        {loading ? (
          <div className='py-8'>
            <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <h3 className='text-xl font-bold text-gray-800'>Verifying Your Payment...</h3>
            <p className='text-gray-500 mt-2 text-sm'>
              Please wait a moment while we confirm your appointment with Stripe.
            </p>
          </div>
        ) : (
          <>
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-600 shadow-inner'>
              <svg
                viewBox='0 0 24 24'
                className='w-10 h-10'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                <polyline points='22 4 12 14.01 9 11.01'></polyline>
              </svg>
            </div>

            <h2 className='text-2xl font-extrabold text-gray-900 sm:text-3xl'>
              Payment Done!
            </h2>
            <p className='text-green-700 font-semibold mt-1 text-sm'>
              Appointment Confirmed & Paid
            </p>

            <p className='text-gray-600 my-4 text-sm leading-relaxed'>
              {statusMessage ||
                'Thank you for completing your secure online payment. Your appointment has been reserved.'}
            </p>

            {verifiedBooking && (
              <div className='bg-blue-50/60 rounded-xl p-4 my-6 text-left border border-blue-100'>
                <h4 className='text-xs uppercase font-bold tracking-wider text-blue-800 mb-2'>
                  Booking Summary
                </h4>
                {verifiedBooking.doctor?.name && (
                  <p className='text-sm text-gray-800 py-0.5 flex justify-between'>
                    <span className='text-gray-500 font-medium'>Doctor:</span>
                    <span className='font-semibold'>{verifiedBooking.doctor.name}</span>
                  </p>
                )}
                {verifiedBooking.ticketPrice && (
                  <p className='text-sm text-gray-800 py-0.5 flex justify-between'>
                    <span className='text-gray-500 font-medium'>Fee Paid:</span>
                    <span className='font-semibold text-green-700'>
                      ₹{verifiedBooking.ticketPrice}
                    </span>
                  </p>
                )}
                <p className='text-sm text-gray-800 py-0.5 flex justify-between'>
                  <span className='text-gray-500 font-medium'>Status:</span>
                  <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500'></span>
                    Paid & Approved
                  </span>
                </p>
              </div>
            )}

            <div className='mt-8 flex flex-col sm:flex-row gap-3 justify-center'>
              <Link
                to='/users/profile/me'
                className='w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all text-sm'
              >
                View My Appointments
              </Link>
              <Link
                to='/home'
                className='w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all text-sm'
              >
                Go Back To Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
