import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRightShort } from 'react-icons/bs';
const ServiceCard = ({ item, index }) => {
  const { name, desc, bgColor, textColor } = item
  return (
    <div className='py-[30px] px-3 lg:px-5'>
      <h2 className='text-[26px] leading-9 text-[#4E545F] font-bold '>{name}</h2>
      <p className='text-[16px] leading-7  font-semibold text-[#4E545F] mt-4'>{desc}</p>

      <div className='flex items-center justify-between mt-[30px] '>
        <Link to='/doctores' className="w-11 h-11 rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-[#0067FF]
        hover:border-none">
          <BsArrowRightShort className='group-hover:text-white w-6 h-5' /></Link>
          <span className='w-11 h-11 flex items-center justify-center text-[18px] leading-[30px] font-semibold '
          style={{
            background:`${bgColor}`,
            color:`${textColor}`,
            borderRadius:"6px 0 0 6px"
          }}>
            {index+1}
          </span>

      </div>

    </div>
  );
}

export default ServiceCard;
