import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../Components/JobCard";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [itemPerPage, setItemPerPage] = useState(3);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [count, setCount] = useState(0);
  const[search,setSearch]=useState('')
   const[searchText,setSearcText]=useState('')
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all jobs with pagination, filtering, and sorting
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/all-jobs?page=${currentPage}&size=${itemPerPage}&filter=${filter}&sort=${sort} &search=${search}`
        );
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    };
    getJobs();
  }, [currentPage, itemPerPage, filter, sort,search]); // Depend on necessary states

  // Fetch total job count for pagination
  useEffect(() => {
    const getCount = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/jobs-count");
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching job count:", error);
      }
    };
    getCount();
  }, []);

  // Handle pagination
  const handlePagination = (value) => {
    if (value !== currentPage) setCurrentPage(value);
  };
    //Search
    const handaleSearch=e=>{
      e.preventDefault()
      
      setSearch(searchText)
        }
      console.log(search);

  // Reset filters and sorting
  const resetFilters = () => {
    setFilter("");
    setSort("");
    setSearch("")
    setSearcText("")
    setCurrentPage(1);
  };



  const totalPages = Math.ceil(count / itemPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between">
      <div>
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="border p-4 rounded-lg"
          >
            <option value="">Filter By Category</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphics Design">Graphics Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>

          <form onSubmit={handaleSearch}>
            <div className="flex p-1 border rounded-lg focus-within:ring focus-within:border-blue-400 focus-within:ring-blue-300">
              <input
                className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none"
                type="text"
                onChange={(e)=>setSearcText(e.target.value)}
                value={searchText}
                placeholder="Enter Job Title"
                name="search"
                aria-label="Enter Job Title"
              />
              <button className="px-4 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                Search
              </button>
            </div>
          </form>

          <select
            onChange={(e) => setSort(e.target.value)}
            value={sort}
            className="border p-4 rounded-md"
          >
            <option value="">Sort By Deadline</option>
            <option value="dsc">Descending Order</option>
            <option value="asc">Ascending Order</option>
          </select>

          <button onClick={resetFilters} className="btn">
            Reset
          </button>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePagination(currentPage - 1)}
          className="px-4 py-2 mx-1 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Previous</span>
          </div>
        </button>

        {pages.map((btnNum) => (
          <button
            key={btnNum}
            onClick={() => handlePagination(btnNum)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === btnNum ? "bg-blue-500 text-white" : "bg-white"
            } hover:bg-blue-500 hover:text-white`}
          >
            {btnNum}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePagination(currentPage + 1)}
          className="px-4 py-2 mx-1 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:text-gray-500"
        >
          <div className="flex items-center">
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mx-1 rtl:-scale-x-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AllJobs;
