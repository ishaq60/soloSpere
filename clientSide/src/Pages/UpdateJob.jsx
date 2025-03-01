import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateJob = () => {
    const navigate=useNavigate()
    const job=useLoaderData()
    const {user}=useAuth()
    console.log(job);
    const {job_title,deadline,
        description
        ,max_price,min_price,
        _id,
    
        category
        }=job
        const [startDate, setStartDate] = useState(new Date(deadline));
        const handaleUpdate= async (e) => {
            e.preventDefault();
        
            const form =   e.target;
        
            const buyer_email = form.user?.value;
            const category = form.category.value;
             const job_title = form.job_title.value;
             const deadline =startDate.value
             const min_price = form.min_price.value;
            const max_price = form.max_price.value;
           
            const description = form.description.value;
            const Jobdata = {
              buyer_email,
              max_price,
              min_price,
              deadline,
              category,
              job_title,
              description,
              bayer :{
                buyer_email,
                name:user?.displayName,
                photo:user?.photoURL
              }
            }
            console.log(Jobdata);
            try {
                const { data } = await axios.put(
                    `http://localhost:8000/job/${_id}`,  // Fixed API URL
                    Jobdata,  // Passing data properly
                    { withCredentials: true } // Fixed options
                );
                
                console.log("Update successful:", data);
                toast.success("Job updated successfully!");
            } catch (error) {
                console.error("Error updating job:", error);
                toast.error("Failed to update job.");
            }
        }

    return (
        <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Update a Job
        </h2>

        <form  onSubmit={ handaleUpdate}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='job_title'>
                Job Title
              </label>
              <input
                id='job_title'
                name='job_title'
                type='text'
                defaultValue={job_title}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                defaultValue={user?.email}
                name='email'
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className="flex flex-col gap-2 ">
                <label className="text-gray-700">Deadline</label>
                <DatePicker
                  className="border p-1 border-gray-400"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                ;{/* Date Picker Input Field */}
              </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>
                Category
              </label>
              <select
                name='category'
                id='category'
                className='border p-2 rounded-md'
                defaultValue={category}
              >
                <option value='Web Development'>Web Development</option>
                <option value='Graphics Design'>Graphics Design</option>
                <option value='Digital Marketing'>Digital Marketing</option>
              </select>
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='min_price'>
                Minimum Price
              </label>
              <input
                id='min_price'
                name='min_price'
                defaultValue={min_price}
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='max_price'>
                Maximum Price
              </label>
              <input
                id='max_price'
                name='max_price'
                defaultValue={max_price}
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>
              Description
            </label>
            <textarea
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='description'
              id='description'
              cols='30'
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  
    );
};

export default UpdateJob;