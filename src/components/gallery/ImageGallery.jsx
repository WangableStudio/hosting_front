import React, { useState } from 'react';

const ImageGallery = ({ images, host }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <div className="content__images">
      {images.map(image => (
        <div key={image.id} className="image-container">
          <img
            src={host + image.path}
            alt={image.id}
            onClick={() => handleImageClick(image)}
            className="image"
          />
        </div>
      ))}

      {selectedImage && (
        <div className="overlay" onClick={handleClose}>
          <div className="modal">
            <img
              src={host + selectedImage.path}
              alt={selectedImage.id}
              className="modal-image"
            />
            <button className="close-button" onClick={handleClose}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;