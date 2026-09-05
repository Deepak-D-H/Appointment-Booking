import React from 'react';
import hreoImg01 from '../assets/images/hero-img01.png';
import hreoImg02 from '../assets/images/hero-img02.png';
import hreoImg03 from '../assets/images/hero-img03.png';
import icon01 from '../assets/images/icon01.png';
import icon02 from '../assets/images/icon02.png';
import icon03 from '../assets/images/icon03.png';
import { Link } from 'react-router-dom';
import { BsArrowRightShort } from 'react-icons/bs';
import featureImg from '../assets/images/feature-img.png';
import About from '../components/About/About.jsx';
import ServiceList from '../components/Services/ServiceList.jsx';
import vidioIcon from '../assets/images/video-icon.png';
import avatarIcon from '../assets/images/avatar-icon.png';
import DoctorList from '../components/Doctors/DoctorList.jsx';
import faqImg from '../assets/images/faq-img.png';
import FaqList from '../components/Faq/FaqList.jsx';
import Testimonial from '../components/Testimonial/Testimonial.jsx';

const Home = () => {
  return (
    <>
      {/* ======== Hero Section ======== */}
      <section className='hero__section pt-[60px] 2xl:h-[800px]'>
        <div className='container'>
          <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between'>
            {/* ======= Hero Content ======= */}
            <div>
              <div className='lg:w-[570px]'>
                <h1 className='text-[36px] leading-[46px] text-[#181a1e] font-extrabold md:text-[60px] md:leading-[70px]'>
                  We help patients live a healthy, longer life.
                </h1>
                <p className='text__para'>
                  Access trusted medical specialists, book appointments online, and receive world-class care anytime, anywhere.
                </p>
                <Link to='/doctors'>
                  <button className='btn cursor-pointer'>Request an Appointment</button>
                </Link>
              </div>

              {/* ========= Hero Counter ========= */}
              <div className='mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]'>
                <div>
                  <h2 className='text-[36px] leading-14 lg:text-[44px] lg:leading-[54px] font-bold text-[#181a1e]'>
                    30+
                  </h2>
                  <span className='w-[100px] h-2 bg-yellow-400 rounded-full block -mt-3.5'></span>
                  <p className='text__para'>Years of Experience</p>
                </div>
                <div>
                  <h2 className='text-[36px] leading-14 lg:text-[44px] lg:leading-[54px] font-bold text-[#181a1e]'>
                    15+
                  </h2>
                  <span className='w-[100px] h-2 bg-purple-400 rounded-full block -mt-3.5'></span>
                  <p className='text__para'>Clinic Locations</p>
                </div>
                <div>
                  <h2 className='text-[36px] leading-14 lg:text-[44px] lg:leading-[54px] font-bold text-[#181a1e]'>
                    100%
                  </h2>
                  <span className='w-[100px] h-2 bg-blue-300 rounded-full block -mt-3.5'></span>
                  <p className='text__para'>Patient Satisfaction</p>
                </div>
              </div>
            </div>

            {/* ======= Hero Images ======= */}
            <div className='flex gap-[30px] justify-end'>
              <div>
                <img className='w-full' src={hreoImg01} alt='Doctor consultation' />
              </div>
              <div className='mt-[30px]'>
                <img className='w-full mb-[30px]' src={hreoImg02} alt='Medical facility' />
                <img className='w-full mb-[30px]' src={hreoImg03} alt='Surgeon' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Features / Services Intro ======== */}
      <section>
        <div className='container'>
          <div className='lg:w-[470px] mx-auto'>
            <h2 className='heading text-center'>Providing the best medical services</h2>
            <p className='text__para text-center'>
              World-class care for everyone. Our health system offers unmatched expert health care.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
            <div className='py-[30px] px-5 flex flex-col items-center text-center'>
              <div className='flex items-center justify-center'>
                <img src={icon01} alt='Find a Doctor' />
              </div>
              <div className='mt-[30px]'>
                <h2 className='text-[26px] leading-9 text-[#181a1e] font-bold'>Find a Doctor</h2>
                <p className='text-[16px] leading-7 text-[#4E545F] font-normal mt-4'>
                  Search certified specialists by department, read patient reviews, and pick the best doctor for your needs.
                </p>
                <Link
                  to='/doctors'
                  className='w-11 h-11 rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-[#0067FF] hover:border-none'
                >
                  <BsArrowRightShort className='group-hover:text-white w-6 h-5' />
                </Link>
              </div>
            </div>

            <div className='py-[30px] px-5 flex flex-col items-center text-center'>
              <div className='flex items-center justify-center'>
                <img src={icon02} alt='Book Appointment' />
              </div>
              <div className='mt-[30px]'>
                <h2 className='text-[26px] leading-9 text-[#181a1e] font-bold'>Book Appointment</h2>
                <p className='text-[16px] leading-7 text-[#4E545F] font-normal mt-4'>
                  Schedule convenient consultation time slots online and get instant booking confirmations.
                </p>
                <Link
                  to='/doctors'
                  className='w-11 h-11 rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-[#0067FF] hover:border-none'
                >
                  <BsArrowRightShort className='group-hover:text-white w-6 h-5' />
                </Link>
              </div>
            </div>

            <div className='py-[30px] px-5 flex flex-col items-center text-center'>
              <div className='flex items-center justify-center'>
                <img src={icon03} alt='Find a Location' />
              </div>
              <div className='mt-[30px]'>
                <h2 className='text-[26px] leading-9 text-[#181a1e] font-bold'>Expert Care</h2>
                <p className='text-[16px] leading-7 text-[#4E545F] font-normal mt-4'>
                  From diagnostics to treatment, our clinical network ensures seamless patient assistance every day.
                </p>
                <Link
                  to='/doctors'
                  className='w-11 h-11 rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-[#0067FF] hover:border-none'
                >
                  <BsArrowRightShort className='group-hover:text-white w-6 h-5' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Services Section */}
      <section>
        <div className='container'>
          <div className='xl:w-[470px] mx-auto'>
            <h2 className='heading text-center'>Our Medical Services</h2>
            <p className='text__para text-center'>
              World-class care for everyone. Our health system offers unmatched, expert health care.
            </p>
          </div>
          <ServiceList />
        </div>
      </section>

      {/* Feature Section */}
      <section>
        <div className='container'>
          <div className='flex items-center justify-between flex-col lg:flex-row'>
            {/* Feature Content */}
            <div className='xl:w-[670px]'>
              <h2 className='heading'>
                Get virtual treatment <br />anytime.
              </h2>
              <ul className='pl-4 space-y-2'>
                <li className='text__para'>1. Schedule the appointment directly online.</li>
                <li className='text__para'>2. Search for your physician and contact their office.</li>
                <li className='text__para'>
                  3. View physicians who are accepting new patients and select an appointment time.
                </li>
              </ul>
              <Link to='/doctors'>
                <button className='btn cursor-pointer'>Learn More</button>
              </Link>
            </div>

            {/* Feature Images */}
            <div className='relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0'>
              <img src={featureImg} className='w-3/4' alt='Feature' />
              <div className='w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px] shadow-md'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1.5 lg:gap-3'>
                    <p className='text-[10px] leading-2.5 lg:text-[14px] lg:leading-5 text-[#181a1e] font-semibold'>
                      Tue, 24
                    </p>
                    <p className='text-[10px] leading-2.5 lg:text-[14px] lg:leading-5 text-[#181a1e] font-normal'>
                      10:00AM
                    </p>
                  </div>
                  <span className='w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellow-300 rounded py-1 px-1.5 lg:py-3 lg:px-[9px]'>
                    <img src={vidioIcon} alt='Video consultation' />
                  </span>
                </div>
                <div className='w-[75px] lg:w-28 bg-[#CCF0F3] py-1 px-2 lg:py-1.5 lg:px-2.5 text-[8px] leading-2 lg:text-[12px] lg:leading-4 text-blue-500 font-medium mt-2 lg:mt-4 rounded-full text-center'>
                  Consultation
                </div>
                <div className='flex items-center gap-1.5 lg:gap-2.5 mt-2 lg:mt-4.5'>
                  <img src={avatarIcon} alt='Avatar' />
                  <h4 className='text-[10px] leading-3 lg:text-[16px] lg:leading-5.5 font-bold text-[#181a1e]'>
                    Wayne Collins
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Great Doctors Section */}
      <section>
        <div className='container'>
          <div className='xl:w-[470px] mx-auto'>
            <h2 className='heading text-center'>Our Great Doctors</h2>
            <p className='text__para text-center'>
              World-class care for everyone. Our health system offers unmatched, expert health care.
            </p>
          </div>
          <DoctorList />
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className='container'>
          <div className='flex justify-between gap-[50px] lg:gap-0 flex-col md:flex-row'>
            <div className='w-full md:w-1/2'>
              <img src={faqImg} alt='FAQ' />
            </div>
            <div className='w-full md:w-1/2'>
              <h2 className='heading'>Most questions by our beloved patients</h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className='container'>
          <div className='xl:w-[470px] mx-auto'>
            <h2 className='heading text-center'>What our patients say</h2>
            <p className='text__para text-center'>
              World-class care for everyone. Our health system offers unmatched, expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Home;
