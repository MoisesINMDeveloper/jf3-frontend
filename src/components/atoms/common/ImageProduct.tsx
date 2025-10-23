// ImageProduct.tsx
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MdOutlineCancel } from 'react-icons/md';

const ImageProduct = ({ images, alt }: { images: string[]; alt: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: images.length > 1,
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx} className="w-full h-48 sm:h-56 md:h-60 lg:h-64">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
              onClick={() => openModal(src)}
            />
          </div>
        ))}
      </Slider>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-800/70 hover:bg-gray-700"
            >
              <MdOutlineCancel className="h-8 w-8 text-white" />
            </button>
            <img
              src={selectedImage ?? ''}
              alt={alt}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageProduct;
