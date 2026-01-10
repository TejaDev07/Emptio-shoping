import React from 'react'
import { Link } from 'react-router-dom'
import Search from '../Search/searchindex';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGitCompareOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { Tooltip, tooltipClasses } from '@mui/material';
import Navigation from './Navigation/nav.jsx';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useAuth } from '../../context/AuthContext';


const OrangeTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#FFA500', // classic orange
    color: '#000',              // black text for contrast
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 6,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));


const  Header = () => {
  const { cart, wishlist } = useCartWishlist();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className='bg-white'>
       <div className="top-strip py-2 border-t-[1px] border-gray-300  border-b-[1px]">
      <div className='container'>
            <div className="flex items-center justify-between">
              <div className='col1 w-[50%]'>
                <p className='text-[14px] font-[400]'>Get upto 50% off new season styles , limited time 🔥</p>
              </div>
              <div className='col2 flex items-center justify-end'>
                <ul className='flex items-center gap-4'>
                  <li className='list-none'>
                    <Link to='/help-center' className='text-[14px] link font-[400] transition'>Help Center</Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/Order-tracking' className='text-[14px] link font-[400] transition'>Order Tracking</Link>
                  </li>
                </ul>
              </div>
            </div>
            
      </div>
       </div>

       <div className='header p-4 border-t-[1px] border-gray-300  border-b-[1px]'> 
          <div className='container flex items-center justify-between'>
                <div className='col1 w-[30%] flex items-center'>
                <Link to={"/"}><img src="/logo1.svg" alt=""  className='flex  w-[65px] h-[65px] rounded-full object-cover' /></Link>
                  <div className=''>
                   <Link to={"/"}><span className="text-3xl font-extrabold text-orange-600 w-64 tracking-wider">Emptio</span>
                   <p className=" text-[8px] text-gray-500 tracking-[3px] mt-1" style={{ wordSpacing: '0.3rem' }}>BIG  MEGA  STORE</p></Link>
                  </div>
               </div>

               <div className='col2 w-[40%]'>
                    <Search/>
               </div>

               <div className='col3 w-[30%] flex items-center '>
                <ul className='flex items-center justify-end gap-3 w-full'>
                  <li className='list-none'>
                    {isAuthenticated() ? (
                      <div className='flex items-center gap-2'>
                        <span className='text-[15px] font-[500]'>Welcome, {user?.name}</span>
                        <button 
                          onClick={handleLogout}
                          className='link transition text-[15px] font-[500] text-orange-600 hover:text-orange-800'
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <>
                        <Link to="/login" className='link transition text-[15px] font-[500]'>Login</Link> | &nbsp;
                        <Link to="/register" className='link transition text-[15px] font-[500]'>Register</Link>
                      </>
                    )}
                  </li>

                  {/* <li>
                  <OrangeTooltip title="Compare">
                      <IconButton aria-label="cart">
                         <StyledBadge badgeContent={4} color="primary">
                            <IoGitCompareOutline color="#1644f2"/>
                         </StyledBadge>
                      </IconButton>
                </OrangeTooltip>
                  </li> */}       

                    <li>
                     <Link to="/wishlist">
                       <OrangeTooltip  title="WishList"  >
                        <IconButton aria-label="wishlist">
                           <StyledBadge badgeContent={wishlist.length} color="primary">
                                < FaRegHeart color='#ed4521 '  />
                           </StyledBadge>
                        </IconButton>
                        </OrangeTooltip>
                     </Link>
                  </li>

                    <li>
                      <Link to="/cart">
                        <OrangeTooltip title="Cart">
                        <IconButton aria-label="cart">
                           <StyledBadge badgeContent={cart.length} color="primary">
                                <MdOutlineShoppingCart color="#10b981"  />
                           </StyledBadge>
                        </IconButton>
                         </OrangeTooltip >
                      </Link>
                  </li>
                </ul>
                
                </div> 
          </div>
       </div>
       
          <Navigation/>
    </header>
  )
}

export default  Header
