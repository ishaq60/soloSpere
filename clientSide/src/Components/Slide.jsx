import React from 'react';
import { Link } from 'react-router-dom';



const Slide = ({image,text}) => {
    return (
        <div 
            className="w-full bg-center bg-cover h-[38rem]" 
            style={{ backgroundImage: `url(${image})` }}>
            'h
            <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold my-7 text-white lg:text-4xl">
                   {text}
                    </h1>
                    <Link to ='/add-job' className="w-full px-5 py-4 mt-5 text-sm font-medium bg-black text-white capitalize transition-colors duration-300 transfor rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                    Project Job & Hire Expert
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Slide;
