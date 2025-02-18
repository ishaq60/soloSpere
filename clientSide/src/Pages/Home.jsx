import React from 'react';

import Carousel from '../Components/Carousel';

import TabCtegory from '../Components/TabCtegory';
import { useLoaderData } from 'react-router-dom';


const Home = () => {
    const jobs=useLoaderData()
    console.log(jobs);
    return (
        <div>
<Carousel/>
<TabCtegory jobs={jobs}/>
        </div>
    );
};

export default Home;