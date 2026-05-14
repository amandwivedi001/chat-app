const ImagePreview = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl"
      >
        ✕
      </button>

      <img
        src={image}
        alt="preview"
        className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
      />

    </div>
  );
};

export default ImagePreview;