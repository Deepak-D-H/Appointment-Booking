import React from 'react';
import { formatDate } from '../../utils/formateDate';

const DoctorAbout = ({ name, about, qualifications = [], experiences = [] }) => {
  return (
    <div>
      <div>
        <h3 className='text-[20px] leading-[30px] text-black font-semibold flex items-center gap-2 '>
          About of
          <span className='text-blue-400 font-bold text-[24px] leading-9'>{name}</span>
        </h3>
        <p className='text__para'>{about}</p>
      </div>

      {/* Education */}
      <div className='mt-12'>
        <h3 className='text-[20px] leading-[30px] text-black font-semibold'>Education</h3>
        <ul className='pt-4 md:p-5'>

          {(qualifications ?? []).map((item, index) => (
            <li key={index} className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
              <div>
                <span className='text-blue-400 text-[15px] leading-6 font-semibold'>
                  {formatDate(item.startingDate)} to {formatDate(item.endingDate)}
                </span>
                <p className='text-[16px] leading-6 font-medium text-gray-600'>{item.degree}</p>
              </div>
              <p className='text-[16px] leading-5 font-medium text-gray-600'>{item.university}</p>
            </li>
          ))}

        </ul>
      </div>

      {/* Experience */}
      <div className='mt-12'>
        <h3 className='text-[20px] leading-[30px] text-black font-semibold'>Experience</h3>
        <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>

          {(experiences ?? []).map((item, index) => (
            <li key={index} className='p-4 rounded bg-[#fff9e5]'>
              <span className='text-yellow-500 text-[15px] leading-6 font-semibold'>
                {formatDate(item.startingDate)} to {formatDate(item.endingDate)}
              </span>
              <p className='text-[16px] leading-6 font-medium text-gray-600'>{item.position}</p>
              <p className='text-[14px] leading-6 font-medium text-gray-600'>{item.hospital}</p>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;






// import React from 'react';
// import { formatDate } from '../../utils/formateDate';

// const DoctorAbout = ({name,about,qualifications,experiences}) => {
//   return (
//     <div>
//       <div>
//          <h3 className='text-[20px] leading-[30px] text-black font-semibold flex items-center gap-2 '>About of
//         <span className='text-blue-400 font-bold text-[24px] leading-9'>{name}</span>
//       </h3>
//       <p className='text__para'>
//         {about}
//       </p>
//       </div>
//       <div className='mt-12'>
//         <h3 className='text-[20px] leading-[30px] text-black font-semibold'>Education</h3>
//         <ul className='pt-4 md:p-5'>

//           {qualifications?.map((item,index)=><li key={index} className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
//             <div>
//               <span className='text-blue-400 text-[15px] leading-6 font-semibold'> {formatDate(item.startingDate)} to {formatDate(item.endingDate)}            
//               </span>
//               <p className='text-[16px] leading-6 font-medium text-gray-600'>{item.degree}</p>
//             </div>
//             <p className='text-[16px] leading-5 font-medium text-gray-600'> {item.university}</p>

//           </li>)}

          
//           {/* <li className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
//             <div>
//               <span className='text-blue-400 text-[15px] leading-6 font-semibold'>
//                 {formatDate('12-4-2024')} to {formatDate('10-5-2026')}             
//               </span>
//               <p className='text-[16px] leading-6 font-medium text-gray-600'>PHD in surgan</p>
//             </div>
//             <p className='text-[16px] leading-5 font-medium text-gray-600'> New Apollo,Hospital bangalur</p>

//           </li> */}

           

//         </ul>

//       </div>

//       <div className="mt-12">
//         <h3 className='text-[20px] leading-[30px] text-black font-semibold'>Experience</h3>
//         <ul  className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>

//           {experiences?.map((item,index)=> <li key={index} className='p-4 rounded bg-[#fff9e5]'>
//             <span className='text-yellow-500 text-[15px] leading-6 font-semibold' >
//               {formatDate(item.startingDate)} to {formatDate(item.endingDate)}
//             </span>
//             <p className='text-[16px] leading-6 font-medium text-gray-600'>{item.position}</p>
//             <p className='text-[14px] leading-6 font-medium text-gray-600'>{item.hospital}</p>
//           </li>)}
         
//           {/* <li className='p-4 rounded bg-[#fff9e5]'>
//             <span className='text-yellow-500 text-[15px] leading-6 font-semibold' >
//               {formatDate('10-4-2029')} to {formatDate('12-1-2030')}
//             </span>
//             <p className='text-[16px] leading-6 font-medium text-gray-600'>Nuro Sergen</p>
//             <p className='text-[14px] leading-6 font-medium text-gray-600'>New Apollo Hospital,Banglore.</p>
//           </li> */}
//         </ul>

      

//       </div>
//     </div>
    
//   );
// }

// export default DoctorAbout;
