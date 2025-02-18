import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import JobCard from './JobCard';
const TabCtegory = ({jobs}) => {
  const {category,
    job_title
    
  }=jobs
  console.log(jobs);
    return (
        <Tabs>
 <div className='container py-10 mx-auto px-6'>
 <h1 className='text-3xl text-center font bold'>Lorem, ipsum dolor sit amet consectetur !</h1>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse vel cum deserunt? Iusto
           quam esse officia suscipit aliquam pariatur iste.</p>
 <TabList>
      <div className='flex my-5 items-center justify-center'>
      
      <Tab>Web Development </Tab>
      <Tab>Graphics</Tab>
      <Tab>Digital M</Tab>
      </div>
    </TabList>

    <TabPanel>
<div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
{
    jobs.
    filter(j=>j.category=== 'Web Development').
    map(job => (
      <JobCard key={job._id} job={job} />
    ))
  }
</div>
</TabPanel>

    <TabPanel>
    <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
{
    jobs.
    filter(j=>j.category=== 'Graphic Design').
    map(job => (
      <JobCard key={job._id} job={job} />
    ))
  }
</div>
    </TabPanel>
    <TabPanel>
    <div className='grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
{
    jobs.
    filter(j=>j.category=== 'Digital Marketing').
    map(job => (
      <JobCard key={job._id} job={job} />
    ))
  }
</div>
    </TabPanel>
 </div>
  </Tabs>
    );
};

export default TabCtegory;