import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd'

const Header = () => {

  const [isSpin, setisSpin] = useState(false);
  const navigate = useNavigate();
  const HandleLogout = async () => {
    setisSpin(true)
    localStorage.removeItem('#657huythj0');
    setisSpin(false)
    navigate('/login')
  }


  return (
    <>
      <Spin size="large" spinning={isSpin} fullscreen={true} />
      <div className='w-full h-fit bg-black p-5 '>
        <div className='flex items-center'>
          <div className='flex-shrink-0'>
            <a href='/'>
              <img src='/logo.png' alt='Logo' className='w-24' />
            </a>
          </div>
          <div className='flex-grow'></div>

          <div className='flex flex-row space-x-16'>
            <a href='/' className='text-gray-400 hover:text-white text-base hover:cursor-pointer'>Normal Request</a>
            <a href='/alert-request' className='text-gray-400 hover:text-white text-base hover:cursor-pointer'>Alert Request</a>
            <a href='/requests' className='text-gray-400 hover:text-white text-base hover:cursor-pointer'>Requests</a>
            {/* <a href='/settings' className='text-gray-400 hover:text-white text-base hover:cursor-pointer'>Settings</a> */}
            <a onClick={HandleLogout} className='text-gray-400 hover:text-white text-base hover:cursor-pointer'>Log out</a>
          </div>
        </div>
      </div>

    </>

  )
}

export default Header