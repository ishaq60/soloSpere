import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const BidsRequest = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient(); // ✅ Initialize queryClient

  // Fetch data function
  const getData = async () => {
    if (!user?.email) {
      console.error("User email is not available");
      return [];
    }
    try {
      const { data } = await axios.get(
        `http://localhost:8000/bids-request/${user.email}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      console.error("Error fetching bids", error);
      throw error; // React Query expects errors to be thrown
    }
  };

  // Fetch bids with react-query
  const { data: bids = [], isLoading, isError, error } = useQuery({
    queryFn: getData,
    queryKey: ["bids", user?.email], // Re-fetch when email changes
    enabled: !!user?.email, // Only fetch if user email is available
  });

  // ✅ Mutation for updating bid status
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.patch(`http://localhost:8000/bid/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success("Data updated successfully");
      queryClient.invalidateQueries(["bids"]); // ✅ Ensure updated data is fetched
    },
  });

  // ✅ Ensure handleRequest does not contain hooks
  const handleRequest = async (id, prevStatus, status) => {
    if (prevStatus === status) {
      toast.error("Already added");
      return;
    }

    try {
      console.log(`Updating bid ${id} with status: ${status}`);
      await mutateAsync({ id, status });
    } catch (error) {
      console.error("Error updating bid:", error.response?.data || error.message);
      toast.error(error.response?.data|| error.message)
    }
  };

  // ✅ Handle loading and error states
  if (isLoading) return <p>Data is still loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
    return (
        <div>
         <section className='container px-4 mx-auto pt-12'>
      <div className='flex items-center gap-x-3'>
        <h2 className='text-lg font-medium text-gray-800 '>Bid Requests</h2>

        <span className='px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full '>
        {bids.length}
        </span>
      </div>

      <div className='flex flex-col mt-6'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden border border-gray-200  md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <div className='flex items-center gap-x-3'>
                        <span>Title</span>
                      </div>
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <div className='flex items-center gap-x-3'>
                        <span>Email</span>
                      </div>
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <span>Deadline</span>
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      <button className='flex items-center gap-x-2'>
                        <span>Price</span>
                      </button>
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      Category
                    </th>

                    <th
                      scope='col'
                      className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                    >
                      Status
                    </th>

                    <th className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'>
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className='bg-white divide-y divide-gray-200 '>
                {
                    bids.map((bid)=>(

                  <tr key={bid._id}>
                    <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
                  {bid.title}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
                   {
                    bid.email
                   }
                    </td>

                    <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
                   {
                    bid.deadline
                   }
                    </td>

                    <td className='px-4 py-4 text-sm text-gray-500  whitespace-nowrap'>
                     {bid.price}
                    </td>
                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                      <div className='flex items-center gap-x-2'>
                        <p
                          className='px-3 py-1 rounded-full text-blue-500 bg-blue-100/60
                           text-xs'
                        >
                       {bid.category}
                        </p>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2
                            ${bid.status === 'pending' ? 'bg-yellow-100/60 text-yellow-500' : ''} 
                            ${bid.status === 'In Progress' ? 'bg-green-100/60 text-green-500' : '' }
                            ${bid.status === 'Rejected' ? ' text-red-500' : '' }
                  
                  
                    
                    
                    `}>
                      
                        <h2 className='text-sm font-normal '>{bid.status}</h2>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                      <div className='flex items-center gap-x-6'>
                      {/**Accept button */}
                        <button onClick={() => handleRequest(bid._id, bid.status, "In Progress")} disabled={bid.status ==='Complete'}
                         className='text-gray-500 transition-colors duration-200   hover:text-red-500 focus:outline-none'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='m4.5 12.75 6 6 9-13.5'
                            />
                          </svg>
                        </button>
             {/**Rejected button */}
                     
                        <button onClick={()=>handleRequest(bid._id, bid.status, "Rejected")}  disabled={bid.status ==='Complete'} className='text-gray-500 transition-colors duration-200   hover:text-yellow-500 focus:outline-none'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636'
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
              
                    ))
                }
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
        </div>
    );
};

export default BidsRequest;