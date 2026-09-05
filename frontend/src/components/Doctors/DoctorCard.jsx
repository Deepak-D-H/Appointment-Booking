import React from 'react';
import starIcon from '../../assets/images/Star.png';
import defaultDoctorImg from '../../assets/images/doctor-img01.png';
import { Link } from 'react-router-dom';
import { BsArrowRightShort } from 'react-icons/bs';

const DoctorCard = ({ doctor }) => {
  if (!doctor) return null;

  const {
    name,
    averageRating,
    avgRating,
    totalRating,
    photo,
    specialization,
    experiences,
  } = doctor;

  const rating = averageRating || avgRating || 0;
  const hospital = experiences && experiences[0]?.hospital ? experiences[0].hospital : 'Medicare Clinic';

  return (
    <div className='p-3 lg:p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between'>
      <div>
        <div className='w-full h-[250px] overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center'>
          <img
            src={photo || defaultDoctorImg}
            alt={name || 'Doctor'}
            className='w-full h-full object-cover rounded-lg'
          />
        </div>

        <h2 className='text-[18px] leading-7 lg:text-[22px] lg:leading-8 text-[#181a1e] font-bold mt-3 lg:mt-4'>
          {name}
        </h2>

        <div className='mt-2 flex items-center justify-between'>
          <span className='bg-[#CCF0F3] text-blue-600 py-1 px-3 text-[14px] rounded font-semibold'>
            {specialization || 'Specialist'}
          </span>
          <div className='flex items-center gap-[6px]'>
            <span className='flex items-center gap-[6px] text-[14px] leading-6 font-semibold text-[#181a1e]'>
              <img src={starIcon} alt='Rating' /> {rating}
            </span>
            <span className='text-[14px] leading-6 font-normal text-[#4E545F]'>
              ({totalRating || 0})
            </span>
          </div>
        </div>
      </div>

      <div className='mt-4 pt-3 border-t border-gray-100 flex items-center justify-between'>
        <div>
          <p className='text-[14px] leading-6 font-normal text-[#4E545F]'>
            At {hospital}
          </p>
        </div>
        <Link
          to={`/doctors/${doctor._id}`}
          className='w-10 h-10 rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-[#0067FF] hover:border-none hover:text-white transition-colors'
        >
          <BsArrowRightShort className='w-6 h-6 text-gray-800 group-hover:text-white' />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
