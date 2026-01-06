import AccessoriesCarousel from "./components/AccessoriesCarousel"
import ProductList from "./components/ProductList"
import Slider from "./components/Slider"

const HomePage = () => {
  return (
    <div className=''>
      <Slider/>
      <div className='mt-24 px-4 md:px-8 lg:px-6 xl:px-32 2xl:px-64'>
        <h1 className='text-3xl font-bold text-gray-900'>Featured Products </h1>
        <ProductList/>
      </div>
      <div className="">
       <AccessoriesCarousel/> 
      </div>
      
    </div>
    
  )
}

export default HomePage