import React, { useState } from 'react';

function WardrobeUpload({ token }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    const res = await fetch('http://localhost:5000/api/wardrobe/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    alert(data.message || 'Upload successful!');
  };

  return (
    <div className="p-4 border rounded">
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <input type="text" placeholder="Caption (e.g. black crop top)" onChange={e => setCaption(e.target.value)} className="ml-2 p-1 border"/>
      <button onClick={handleUpload} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">Upload</button>
    </div>
  );
}

export default WardrobeUpload;
