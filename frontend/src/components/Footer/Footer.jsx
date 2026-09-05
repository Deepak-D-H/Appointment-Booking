import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { AiFillYoutube, AiFillGithub, AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';

const socialLinks = [
  {
    path: 'https://youtube.com',
    icon: <AiFillYoutube className='group-hover:text-white w-4 h-5' />,
  },
  {
    path: 'https://github.com',
    icon: <AiFillGithub className='group-hover:text-white w-4 h-5' />,
  },
  {
    path: 'https://instagram.com',
    icon: <AiFillInstagram className='group-hover:text-white w-4 h-5' />,
  },
  {
    path: 'https://linkedin.com',
    icon: <AiFillLinkedin className='group-hover:text-white w-4 h-5' />,
  },
];

const quickLinks01 = [
  {
    path: '/home',
    display: 'Home',
  },
  {
    path: '/doctors',
    display: 'Find a Doctor',
  },
  {
    path: '/services',
    display: 'Services',
  },
  {
    path: '/contact',
    display: 'Contact Us',
  },
];

const quickLinks02 = [
  {
    path: '/doctors',
    display: 'Find a Doctor',
  },
  {
    path: '/doctors',
    display: 'Request an Appointment',
  },
  {
    path: '/services',
    display: 'Clinical Services',
  },
  {
    path: '/contact',
    display: 'Get an Opinion',
  },
];

const quickLinks03 = [
  {
    path: '/contact',
    display: 'Support Center',
  },
  {
    path: '/contact',
    display: 'Contact Us',
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='pb-16 pt-10 border-t border-gray-200 mt-10'>
      <div className='container'>
        <div className='flex justify-between flex-col md:flex-row flex-wrap gap-[30px]'>
          <div>
            <Link to='/home'>
              <img src={logo} alt='Medicare logo' />
            </Link>
            <p className='text-[16px] leading-7 font-normal text-gray-500 mt-4'>
              &copy; {year} Medicare Booking. All rights reserved.
            </p>
            <div className='flex items-center gap-3 mt-4'>
              {socialLinks.map((link, index) => (
                <a
                  href={link.path}
                  key={index}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-blue-500 hover:border-none'
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-[20px] leading-[30px] font-bold mb-6 text-black'>
              Quick Links
            </h2>
            <ul>
              {quickLinks01.map((item, index) => (
                <li key={index} className='mb-4'>
                  <Link to={item.path} className='text-[16px] leading-7 font-normal text-gray-500 hover:text-blue-600'>
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className='text-[20px] leading-[30px] font-bold mb-6 text-black'>
              I want to:
            </h2>
            <ul>
              {quickLinks02.map((item, index) => (
                <li key={index} className='mb-4'>
                  <Link to={item.path} className='text-[16px] leading-7 font-normal text-gray-500 hover:text-blue-600'>
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className='text-[20px] leading-[30px] font-bold mb-6 text-black'>
              Support:
            </h2>
            <ul>
              {quickLinks03.map((item, index) => (
                <li key={index} className='mb-4'>
                  <Link to={item.path} className='text-[16px] leading-7 font-normal text-gray-500 hover:text-blue-600'>
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
