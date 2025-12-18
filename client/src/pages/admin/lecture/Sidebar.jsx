import { ChartNoAxesColumn, SquareLibrary, Menu } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const minWidth = 200;
  const maxWidth = 500;

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className='flex'>
      {/* Mobile Menu Button */}
      <div className='md:hidden fixed top-20 left-4 z-50'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] p-0">
            <SheetHeader className="p-6 pb-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className='space-y-1'>
              <Link to="/admin/dashboard" onClick={() => setOpen(false)} className='flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-800 pl-6 pr-4 py-3'>
                <ChartNoAxesColumn size={22} />
                <h1>Dashboard</h1>
              </Link>
              <Link to="/admin/courses" onClick={() => setOpen(false)} className='flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-800 pl-6 pr-4 py-3'>
                <SquareLibrary size={22} />
                <h1>Courses</h1>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div 
        ref={sidebarRef}
        className='hidden md:block fixed left-0 top-16 border-r border-r-gray-300 dark:border-r-gray-700 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900'
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className='space-y-1 pt-6'>
          <Link to="/admin/dashboard" className='flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-800 pl-6 pr-4 py-3'>
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="/admin/courses" className='flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-800 pl-6 pr-4 py-3'>
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
        
        {/* Resizable Handle */}
        <div
          className='absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 hover:w-1.5 transition-all'
          onMouseDown={handleMouseDown}
        >
        </div>
      </div>
      
      {/* Content Area */}
      <div 
        className='md:flex-1 mt-16 p-4 md:p-6 transition-all'
        style={{ marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0' }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Sidebar
