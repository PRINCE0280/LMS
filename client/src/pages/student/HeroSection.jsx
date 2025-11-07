import { Button } from '@/components/ui/button';
import React from 'react'

const HeroSection = () => {
      const handleExplore = () => {
            const section = document.getElementById('explore');
            if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
      };

      return (
                  <div className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center overflow-x-hidden'>
                  <div className='max-w-2xl mx-auto'>
                        <h1 className='text-white text-4xl font-bold mb-4'>Find the best Courses for You</h1>
                        <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover, learn, and Upskill with our wide range of courses.</p>
                          <div className='max-w-3xl w-full mx-auto rounded-full px-6 md:px-8 lg:px-10'>
                                <form action="" className='flex items-stretch bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden w-full h-[2.75rem] md:h-[3.25rem] transition-all duration-200 ring-2 ring-black/5 dark:ring-white/10 hover:ring-blue-400/60 dark:hover:ring-white/30 focus-within:ring-blue-500 hover:bg-white/95 dark:hover:bg-gray-700 hover:shadow-xl'>
                                      <div className="flex-1">
                                            <input type="text" className="w-full h-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none px-6 transition-colors text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/50" placeholder="Search for courses..." />
                                      </div>
                                      <Button className="relative bg-blue-600 dark:bg-blue-500 text-white px-6 py-0 h-full rounded-l-none rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible:ring-0 ring-0 border-0 outline-none whitespace-nowrap transition-all duration-200 cursor-pointer before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-white/40 dark:before:bg-white/20">Search</Button>                          
                                </form>
                                <Button onClick={handleExplore} className="mt-4 bg-white dark:bg-gray-800 text-blue-600 rounded-full px-6 py-2 shadow-md hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer">Explore Courses</Button>
                          </div>
                  </div>
            </div>

      );
};
export default HeroSection;