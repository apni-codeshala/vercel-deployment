import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, createBrowserRouter } from 'react-router-dom'
import {RouterProvider} from 'react-router-dom'
import Home from './components/home/Home.jsx'
import Login from './components/login/Login.jsx'
import Register from './components/register/Register.jsx'
import AccountPage from './components/account/AccountPage.jsx'
import Bookings from './components/account/Bookings.jsx'
import Places from './components/account/Places.jsx'
import PlacesPage from './components/pages/PlacesPage.jsx'
import HomeIndex from './components/home/HomeIndex.jsx'
import SinglePlacePage from './components/places/SinglePlacePage.jsx'
const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/home',
        element:<Home/>
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/register',
        element:<Register/>
      },
      
      {
        path:'/account/:subPage?',
        element:<AccountPage/>
      },
      {
        path:'/account/:subPage?',
        element:<Places/>
      },
      {
        path:'/account/:subPage/:action?',
        element:<PlacesPage/>
      },
      {
        path:'/',
        element:<HomeIndex/>
      },
      {
        path:'/place/:subPlace?',
        element:<SinglePlacePage/>
      },
     
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
