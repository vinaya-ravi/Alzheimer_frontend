import React, { useState } from 'react';

const UploadImage = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload an image.');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/predict`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    onUpload(result);
  };

  return (
    <div className="container">
      <h2 className="text-center">Upload MRI Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="btn btn-primary">Predict</button>
      </form>
    </div>
  );
};

export default UploadImage;
