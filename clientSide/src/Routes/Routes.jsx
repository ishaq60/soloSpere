import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main from "../Layouts/Main";
import Home from "../Pages/Home";
import LogIn from "../Pages/Authntication/LogIn";
import Register from "../Pages/Authntication/Register";
import JobDetails from "../Components/JobDetails";
import AddJob from "../Components/AddJob";
import ErrorPage from "../Pages/ErrorPage";
import MyPostedJob from "../Components/MyPostedJob";
import PrivateRoutes from "../Provider/PrivateRoutes";
import MyBids from "../Pages/MyBids";

const router = createBrowserRouter([
{
  path:"/",
  element:<Main/>,
  errorElement:<ErrorPage/>,
  children:[
 {
    index: true,
    element: <Home />,
    loader: async () => {
      const response = await fetch('http://localhost:8000/jobs');
      const data = await response.json();
      return data; // This will be available via useLoaderData
    }
  },
    
    {
      path:"/login",
      element:<LogIn/>
    },
    {
path:"/register",
element:<Register/>
    },
    {
      path:"/job/:id",
      element: <PrivateRoutes>
       <JobDetails/>
      </PrivateRoutes>
      
    ,
      loader:({params})=>fetch(`http://localhost:8000/job/${params.id}`)
    },
    {
      path:'/add-job',
      element: <PrivateRoutes>
      <AddJob/>
      </PrivateRoutes>
   
    },
    {
      path:"/my-posted-job",
      element:
      <PrivateRoutes>
   <MyPostedJob/>
      </PrivateRoutes>
   

    },
    {
      path:'/my-bids',
      element:
      <PrivateRoutes>
  <MyBids/>
      </PrivateRoutes>
    
    }
  ]
}

]);
export default router