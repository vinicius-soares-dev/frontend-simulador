import Cropper from 'react-easy-crop';
import { useCallback, useState } from 'react';
import { getCroppedImg } from '../utils/cropImage';

type Props = {
  image: string;
  onCropComplete: (file: File) => void;
  onClose: () => void;
};

const CropperModal = ({ image, onCropComplete, onClose }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const croppedFile = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(croppedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-[90vw] h-[70vh] bg-white rounded-xl overflow-hidden relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={16 / 5}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteHandler}
        />
        <div className="absolute bottom-4 right-4 flex gap-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleDone}>Recortar</button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
