import React from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Routers from '../routers/Routers';

const Layout = () => {
  return (
    <div>
      <Header/>
      <main>
        <Routers/>
      </main>
      <Footer/>
      
    </div>
  );
}

export default Layout;
