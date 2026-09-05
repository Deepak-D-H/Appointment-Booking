import React from 'react';
import convertTime from '../../utils/convertTime';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const bookingHandler = async () => {
    try {
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        toast.error('Please log in to book an appointment');
        return;
      }

      // Prevent booking if ticketPrice is missing or invalid
      if (ticketPrice === undefined || ticketPrice === null || isNaN(Number(ticketPrice))) {
        toast.error('Ticket price is not available. Please contact the clinic.');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/v1/bookings/checkout-session/${doctorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ appointmentDate: new Date().toISOString() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data && data.message ? data.message : 'Booking failed. Please try again');
      }

      if (data.session && data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='shadow-panelShadow p-3 lg:p-5 rounded-md border border-gray-100 bg-white'>
      <div className='flex items-center justify-between'>
        <p className='text__para mt-0 font-semibold'>Appointment Fee</p>
        <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-black font-bold'>
          {ticketPrice !== undefined ? `${ticketPrice} INR` : 'Consult'}
        </span>
      </div>

      <div className='mt-[30px]'>
        <p className='text__para mt-0 font-semibold text-gray-700'>
          Available Time Slots
        </p>

        <ul className='mt-3'>
          {timeSlots && timeSlots.length > 0 ? (
            timeSlots.map((item, index) => (
              <li key={index} className='flex items-center justify-between mb-2'>
                <p className='text-[15px] leading-6 text-gray-700 font-semibold'>
                  {item?.day ? item.day.charAt(0).toUpperCase() + item.day.slice(1) : 'Flexible'}
                </p>
                <p className='text-[15px] leading-6 text-gray-700 font-semibold'>
                  {item?.startingTime ? convertTime(item.startingTime) : '10:00 AM'} -{' '}
                  {item?.endingTime ? convertTime(item.endingTime) : '05:00 PM'}
                </p>
              </li>
            ))
          ) : (
            <li className='text-sm text-gray-500 italic py-2'>
              Standard hours: Mon - Fri (09:00 AM - 05:00 PM)
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={bookingHandler}
        className='btn px-2 w-full rounded-md cursor-pointer hover:bg-blue-600 transition-colors'
      >
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;
