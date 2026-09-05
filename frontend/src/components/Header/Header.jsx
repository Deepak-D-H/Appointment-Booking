import React, { useEffect, useRef, useContext } from 'react';
import logo from '../../assets/images/logo.png';
import { NavLink, Link } from 'react-router-dom';
import userImg from '../../assets/images/avatar-icon.png';
import { BiMenu } from 'react-icons/bi';
import { authContext } from '../../context/AuthContext';

const navLinks = [
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
    display: 'Contact',
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const { user, role, token } = useContext(authContext);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('stickey__header');
      } else {
        headerRef.current.classList.remove('stickey__header');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle('show__menu');
    }
  };

  return (
    <header className='header flex items-center' ref={headerRef}>
      <div className='container'>
        <div className='flex items-center justify-between'>
          <div>
            <Link to='/home'>
              <img src={logo} alt='Medicare Logo' />
            </Link>
          </div>

          <div className='navigation' ref={menuRef} onClick={toggleMenu}>
            <ul className='menu flex items-center gap-[2.7rem]'>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? 'text-[#0067FF] text-[16px] leading-7 font-semibold'
                        : 'text-[#4E545F] text-[16px] leading-7 font-medium hover:text-[#0067FF]'
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex items-center gap-4'>
            {token && user ? (
              <div className='flex items-center gap-3'>
                <Link to={role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me'}>
                  <figure className='w-[35px] h-[35px] rounded-full cursor-pointer overflow-hidden border border-blue-500'>
                    <img
                      src={user?.photo || userImg}
                      className='w-full h-full object-cover rounded-full'
                      alt={user?.name || 'User Profile'}
                    />
                  </figure>
                </Link>
                <Link
                  to={role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me'}
                  className='hidden md:block text-[14px] font-semibold text-gray-800 hover:text-blue-600'
                >
                  {user.name}
                </Link>
              </div>
            ) : (
              <Link to='/login'>
                <button className='bg-[#0067FF] py-2 px-6 text-white font-semibold h-11 flex items-center justify-center rounded-[50px] cursor-pointer hover:bg-blue-600'>
                  Login
                </button>
              </Link>
            )}

            <span className='md:hidden' onClick={toggleMenu}>
              <BiMenu className='w-6 h-6 cursor-pointer' />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
