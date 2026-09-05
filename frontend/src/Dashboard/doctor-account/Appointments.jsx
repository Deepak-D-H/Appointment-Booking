import React from 'react';
import { formatDate } from '../../utils/formateDate';
import avatarIcon from '../../assets/images/avatar-icon.png';

const Appointments = ({ appointments }) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div className='text-center py-10'>
        <h3 className='text-[18px] text-gray-600 font-medium'>No appointments booked yet.</h3>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-sm text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Patient
            </th>
            <th scope='col' className='px-6 py-3'>
              Gender
            </th>
            <th scope='col' className='px-6 py-3'>
              Payment Status
            </th>
            <th scope='col' className='px-6 py-3'>
              Fee
            </th>
            <th scope='col' className='px-6 py-3'>
              Booked on
            </th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((item) => (
            <tr key={item._id} className='border-b hover:bg-gray-50'>
              <th
                scope='row'
                className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'
              >
                <img
                  src={item.user?.photo || avatarIcon}
                  className='w-10 h-10 rounded-full object-cover'
                  alt={item.user?.name || 'Patient'}
                />
                <div className='pl-3'>
                  <div className='text-base font-semibold'>
                    {item.user?.name || 'Patient'}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {item.user?.email || 'N/A'}
                  </div>
                </div>
              </th>
              <td className='px-6 py-4 capitalize'>
                {item.user?.gender || 'N/A'}
              </td>
              <td className='px-6 py-4'>
                {item.isPaid || item.status === 'approved' ? (
                  <div className='flex items-center gap-2'>
                    <span className='h-2.5 w-2.5 rounded-full bg-green-500'></span>
                    <span className='text-green-700 font-semibold'>Paid</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <span className='h-2.5 w-2.5 rounded-full bg-red-500'></span>
                    <span className='text-red-600 font-semibold'>Unpaid</span>
                  </div>
                )}
              </td>
              <td className='px-6 py-4 font-semibold'>
                {item.ticketPrice ? `₹${item.ticketPrice}` : 'Free'}
              </td>
              <td className='px-6 py-4'>
                {formatDate(item.appointmentDate || item.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
