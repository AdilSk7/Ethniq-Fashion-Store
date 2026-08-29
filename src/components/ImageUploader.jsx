import { useState, useCallback } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';
import './ImageUploader.css';

export default function ImageUploader({
  onFilesSelected,
  multiple = true,
  existingImages = [],
  onRemoveExisting,
  maxFiles = 10,
}) {
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, maxFiles - existingImages.length - previews.length);
    const newPreviews = arr.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    onFilesSelected([...previews.map((p) => p.file), ...arr]);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [previews, existingImages]
  );

  const removePreview = (idx) => {
    const newPreviews = previews.filter((_, i) => i !== idx);
    setPreviews(newPreviews);
    onFilesSelected(newPreviews.map((p) => p.file));
  };

  return (
    <div className="image-uploader">
      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="upload-grid">
          {existingImages.map((url, idx) => (
            <div key={idx} className="upload-preview">
              <img src={url} alt={`Image ${idx + 1}`} />
              {onRemoveExisting && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => onRemoveExisting(idx)}
                  aria-label="Remove image"
                >
                  <FiX size={14} />
                </button>
              )}
              <span className="img-label">Saved</span>
            </div>
          ))}
        </div>
      )}

      {/* New previews */}
      {previews.length > 0 && (
        <div className="upload-grid">
          {previews.map((p, idx) => (
            <div key={idx} className="upload-preview new">
              <img src={p.url} alt={`Preview ${idx + 1}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removePreview(idx)}
                aria-label="Remove"
              >
                <FiX size={14} />
              </button>
              <span className="img-label">New</span>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input-hidden').click()}
      >
        <FiUploadCloud size={32} />
        <p>Drag & drop images here or <strong>click to browse</strong></p>
        <p className="drop-hint">
          PNG, JPG, WEBP up to 10MB • {multiple ? `Max ${maxFiles} images` : '1 image'}
        </p>
        <input
          id="file-input-hidden"
          type="file"
          accept="image/*"
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
