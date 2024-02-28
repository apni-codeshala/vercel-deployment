import React, { useEffect,useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
// Create a context to hold the user information

// Custom hook to use the user context


const Header = (props) => {
  const navigate=useNavigate()
  const [UserData, setUserData] = useState('')
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if(!accessToken){
      navigate('/login')
    }
    // console.log(accessToken)
    const fetchUserData = async () => {
      try {
        if (accessToken) {
          const response = await axios.get(`http://localhost:8000/api/v1/users/current-user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          console.log(response.data.data);
          setUserData(response.data.data);
          // console.log(userData);
        } else {
          console.log('No access token available');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

   
  return (

    <header className="flex items-center gap-5 justify-between">
      <Link to="/" className="flex items-center gap-1 justify-center">
        <svg
          className="w-4 h-4 mt-1 "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 44 48"
          id="airbnb"
        >
          <path
            fill="#ff5a5f"
            d="M43.2 33.5l-.2-.6c-.2-.4-.3-.8-.5-1.1-.2-.4-.3-.8-.5-1.1l-.6-1.2-.1-.1C38 22.2 34.6 15.3 31.2 8.7l-.1-.3c-.4-.7-.8-1.4-1.1-2.2l-.2-.2c-.4-.8-.9-1.6-1.6-2.4-1.5-1.9-3.8-3-6.2-3-2.4 0-4.6 1-6.2 2.9-.7.9-1.2 1.8-1.7 2.6-.4.7-.7 1.5-1.1 2.2l-.1.3C9 16.1 5.6 22.9 2.7 29.3l-.1.1c-.2.4-.4.8-.5 1.2-.2.4-.3.7-.5 1.1-.2.5-.5 1.1-.7 1.7-.6 1.8-.8 3.5-.6 5.2.5 3.6 2.9 6.6 6.3 8 1.2.5 2.5.8 3.9.8.4 0 .9-.1 1.3-.1 1.6-.2 3.3-.7 4.8-1.6 1.8-1 3.5-2.4 5.5-4.5 1.9 2 3.7 3.4 5.5 4.5 1.5.9 3.1 1.4 4.8 1.6.3 0 .8.1 1.3.1 1.4 0 2.8-.3 3.9-.8 3.3-1.3 5.7-4.4 6.3-8 .1-1.5-.1-3.2-.7-5.1zm-25.5-8.7c.1-.6.3-1.2.6-1.7.8-1.2 2.1-1.8 3.6-1.8 1.6 0 2.9.7 3.6 1.8.4.5.6 1.1.7 1.7.1.8.1 1.7-.1 2.6-.5 2.2-1.9 4.9-4.2 7.9-2.2-2.9-3.7-5.6-4.2-7.9-.1-1-.1-1.8 0-2.6zM30 28.4c.3-1.4.4-2.7.2-4.1-.2-1.2-.6-2.4-1.3-3.3-1.5-2.2-4-3.5-6.9-3.5-2.8 0-5.3 1.3-6.9 3.5-.7 1-1.1 2.1-1.3 3.3-.2 1.3-.1 2.7.2 4.1.7 3 2.5 6.4 5.4 10.1-1.7 1.9-3.3 3.2-4.8 4.1-1.1.6-2.2 1-3.3 1.1-1.1.1-2.2 0-3.3-.4-2.1-.9-3.6-2.8-3.9-5-.1-1.3 0-2.3.5-3.5.1-.3.2-.6.4-.9.1-.2.1-.3.2-.5.3-.7.7-1.5 1-2.3V31c3.4-7.2 6.8-14.2 10.1-20.6l.1-.3c.2-.3.4-.7.6-1.1.2-.4.4-.7.6-1.1.4-.8.8-1.4 1.2-1.9.9-1 2-1.5 3.3-1.5s2.4.5 3.3 1.5c.4.5.8 1.1 1.2 1.9.2.3.4.7.5 1.1.2.4.4.7.5 1l.1.3c3.5 6.8 6.8 13.7 10 20.5l.1.2c.2.4.3.7.5 1.1.2.4.4.8.5 1.1.1.2.1.3.2.5.2.3.3.6.4.9.4 1.2.5 2.3.3 3.3-.3 2.2-1.8 4.1-3.9 5-1 .4-2.1.6-3.2.4-1.1-.1-2.2-.5-3.3-1.1-1.5-.8-3-2.1-4.8-4.1 3-3.3 4.8-6.7 5.5-9.7z"
          ></path>
        </svg>
        <h5 className="text-red-600 font-bold text-xl md:block ">
          airbnb
        </h5>
      </Link>
      <div className="hidden md:flex items-center gap-5 shadow-md shadow-gray-300 justify-center border border-solid p-2 rounded-full">
        <div className="font-semibold">Anywhere</div>
        <div className="border-l border-gray-300 h-6"></div>
        <div className="">Any week</div>
        <div className="border-l border-gray-300 h-6"></div>
        <div className="font-extralight">Add guests</div>
        <button className="bg-pink-700 rounded-full p-1 text-white">
         {
          props.username?(props.username):( <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>)
         }
        </button>
      </div>

      <div className="flex items-center gap-2 justify-center border border-solid p-2 rounded-full ">
        <div className="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={'1.5'} className="w-6 h-6" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
    
        </div>
        {
          UserData?(<>
      <Link to="/home">
  <div className="group bg-gray-600 text-white rounded-full relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 group-hover:text-opacity-100 text-opacity-0 transition-opacity duration-300"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>

    <h6 className="absolute border-2 rounded-lg p-4 uppercase text-black top-10 right-[-1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{UserData.username}</h6>
  </div>
</Link>

          </>):(<>
            <Link to="/login">
          <div  className="bg-gray-600 text-white rounded-full">
           <button className="p-2 uppercase font-mono">Login</button>
          </div>
         
        </Link>
          </>)
        }
      </div>
    </header>
  );
};

export default Header;