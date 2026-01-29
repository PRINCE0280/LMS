import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-[#111827]'>
         <ScrollToTop />
         <Navbar />
        <div className='flex-1 bg-white dark:bg-[#111827]'>
          <Outlet />
        </div>
    </div>
  )
}

export default MainLayout
