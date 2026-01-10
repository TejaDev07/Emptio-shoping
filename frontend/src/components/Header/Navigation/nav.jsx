
import React from 'react'
import  Button  from '@mui/material/Button';
import { RiMenu2Fill } from "react-icons/ri";
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import { useState } from 'react';
import Sidebar from './Sidebar';
import './nav.css'


const Navigation = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
   <nav className='py-2'>
     <div className='container flex items-center '>
       <div className='col_1 w-[20%] '>
            <Button 
              onClick={toggleSidebar}
            className='!text-black !gap-2  w-full normal-case'
             aria-expanded={isSidebarOpen}
             >
                 <RiMenu2Fill className='text-[18px] ' />
                 SHOP BY CATEGORIES
                 <TfiAngleDown className='text-[14px] ml-auto ' />
            </Button>
       </div>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

       <div className='col_2 w-[80%]  '>
           <ul className='flex items-center gap-9 nav'>
                <li className='list-none'>
                  <Link to='/'  className='link transition '>
                      <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e] !normal-case'>Home</Button>
                  </Link>
                </li>
               <li className='list-none relative '>
                 <Link to='/products/fashion'  className='link transition'>
                   <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Fashion</Button>
                   </Link>
                
                <div className='submenu absolute top-[120%] left-[0%] min-w-[200px] bg-white shadow-md 
                opacity-0 transition-all'>
                  <ul>
                    <li className='list-none w-full relative'>
                      <Link to='/products/fashion/men'  className='w-full'>
                     <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full  !justify-start'>Men</Button>
                     </Link>

                        <div className='submenu absolute top-[0%] left-[100%] min-w-[200px] bg-white shadow-md 
                        opacity-0 transition-all'>
                          <ul>
                            <li className='list-none w-full'>
                              <Link to='/products/fashion/men/t-shirts'  className='w-full'>
                            <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full  !justify-start'>T-shirts&polos</Button>
                            </Link>
                            </li>

                              <li className='list-none w-full'>
                              <Link to='/products/fashion/men/shirts'  className='w-full'>
                            <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>Shirts</Button>
                            </Link>
                            </li>

                              <li className='list-none  w-full'>
                              <Link to='/products/fashion/men/jeans'  className='w-full'>
                            <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>jeans</Button>
                            </Link>
                            </li>

                              <li className='list-none  w-full'>
                              <Link to='/products/fashion/men/innerwear'  className='w-full'>
                            <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>innerwear</Button>
                            </Link>
                            </li>
                          </ul>
                        </div>

                     </li>

                      <li className='list-none w-full'>
                      <Link to='/products/fashion/women'  className='w-full'>
                     <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>Women</Button>
                     </Link>
                    </li>

                      <li className='list-none  w-full'>
                      <Link to='/products/fashion/kids'  className='w-full'>
                     <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>Girls</Button>
                     </Link>
                    </li>

                      <li className='list-none  w-full'>
                      <Link to='/products/fashion/kids'  className='w-full'>
                     <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>Boys</Button>
                     </Link>
                    </li>

                      <li className='list-none  w-full'>
                      <Link to='/'  className='w-full'>
                     <Button className='!text-[rgba(0,0,0,0.8)] hover:!text-[#ff3e3e]  w-full !justify-start'>Kids</Button>
                     </Link>
                    </li>
                  </ul>
                </div>

           </li>
           <li className='list-none'>
                <Link to='/products/electronics'  className='link transition text-[14px] font-[500] '>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Electronics</Button>
                </Link>
           </li>
           <li className='list-none'>
                <Link to='/products/bags'  className='link transition text-[14px] font-[500]'>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Bags</Button>
               </Link>
           </li>
           <li className='list-none'>      
              <Link to='/products/footwear'  className='link transition text-[14px] font-[500]'>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Footwear</Button>
              </Link>
           </li>
             <li className='list-none'>      
              <Link to='/products/groceries'  className='link transition text-[14px] font-[500]'>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Groceries</Button>
            </Link>
           </li>
            <li className='list-none'>      
              <Link to='/products/beauty'  className='link transition text-[14px] font-[500]'>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Beauty</Button>
              </Link>
           </li>
            <li className='list-none'>      
              <Link to='/products/wellness'  className='link transition text-[14px] font-[500]'>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'> Wellness</Button>
             </Link>
           </li>
            <li className='list-none'>      
              <Link to='/products/jewellery'  className='link transition text-[14px] font-[500]'>
                 <Button className='!text-[14px] !font-[500] !text-[rgb(0,0,0,0.9)] hover:!text-[#ff3e3e]  !normal-case'>Jewellery</Button>
              </Link>
           </li>
           </ul>
       </div>

       {/* <div className='col_3 w-[20%]'>
        <p className='flex items-center justify-center gap-1 text-[13px]'>
          <GoRocket  className=''/>
          Free International Delivery
        </p>
       </div> */}

     </div>
   </nav>
  )
}

export default Navigation;
