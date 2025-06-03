import { useState } from 'react';
import axios from 'axios';
import { ImagePlus, Link2, UploadCloud } from 'lucide-react';
import CropperModal from './CropperModal';


const BannerUpload = () => {
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setRawImage(imageUrl);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
  setFile(croppedFile);
  setPreview(URL.createObjectURL(croppedFile));
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !linkUrl) return;

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('bannerImage', file);
      formData.append('linkUrl', linkUrl);

      await axios.post('https://portalaeronauta.com/ads/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Banner enviado com sucesso!');
      setLinkUrl('');
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 rounded-2xl shadow-2xl mb-8">
          <div className="flex items-center gap-4" style={{ marginTop: "3rem"}}>
            <ImagePlus className="w-12 h-12 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Upload de Banner</h1>
              <p className="text-blue-200 mt-1">Adicione novos banners promocionais ao site</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Link Input */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-blue-100 text-lg font-medium">
                <Link2 className="w-6 h-6" />
                Link de Destino
              </label>
              <div className="flex items-center gap-3 bg-white/20 rounded-lg p-4">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-transparent text-blue-100 placeholder-blue-300 focus:outline-none"
                  placeholder="https://exemplo.com/promocao"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-blue-100 text-lg font-medium">
                <UploadCloud className="w-6 h-6" />
                Imagem do Banner
              </label>
              
              <div className="group relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, image/webp"
                  required
                />
                <div className="bg-white/20 rounded-xl border-2 border-dashed border-blue-300 p-8 text-center transition-all group-hover:border-blue-400">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mb-4 border-4 border-blue-200"
                    />
                  ) : (
                    <>
                      <div className="text-blue-200 mb-4">
                        <UploadCloud className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-blue-200">
                        Arraste e solte ou clique para selecionar
                      </p>
                      <p className="text-sm text-blue-300 mt-2">
                        Tamanho recomendado: 1920x600px (PNG, JPG, WEBP)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {showCropper && rawImage && (
              <CropperModal
                image={rawImage}
                onCropComplete={handleCropComplete}
                onClose={() => setShowCropper(false)}
              />
            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6" />
                  <span>Publicar Banner</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerUpload;