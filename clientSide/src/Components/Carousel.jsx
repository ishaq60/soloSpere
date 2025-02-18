
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import bgm1 from "../../public/images/carousel1.jpg"
import bgm2 from "../../public/images/carousel2.jpg"
import bgm3 from "../../public/images/carousel3.jpg"


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Slide from './Slide';

export default function Carousel() {
  return (
    <div className='container mx-auto px-6 py-8  '>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
      
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide >
         <Slide image={bgm1}
         text='Get Your Web Development Project Done in Minute '
         />
        </SwiperSlide>
        <SwiperSlide>
         <Slide image={bgm2}
         text='Get Your Grapics Development Project Done in Minute'
         
         />
        </SwiperSlide>
        <SwiperSlide>
         <Slide  image={bgm3}
           text='Get Your Grapics Design Project Done in Minute'/>
        </SwiperSlide>
        
        
      </Swiper>
    </div>
  );
}