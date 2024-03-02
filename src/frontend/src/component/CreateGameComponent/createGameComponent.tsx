// CreateGameComponent.tsx
import React, { useState, ChangeEvent } from 'react';

const CreateGameComponent: React.FC = () => {
  const [gamePrompt, setGamePrompt] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [lotteryFee, setLotteryFee] = useState<string>('');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleCreate = () => {
    console.log({ gamePrompt, image, lotteryFee });
    // Here you would handle the creation logic, such as sending data to your backend
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Enter game prompt..."
        value={gamePrompt}
        onChange={(e) => setGamePrompt(e.target.value)}
        style={{ margin: '10px 0', display: 'block', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <input
        type="file"
        onChange={handleImageChange}
        style={{ margin: '10px 0', display: 'block', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <input
        type="number"
        placeholder="Initial lottery pooling fee..."
        value={lotteryFee}
        onChange={(e) => setLotteryFee(e.target.value)}
        style={{ margin: '10px 0', display: 'block', width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
      />
      <button onClick={handleCreate} style={{ color:"white", marginTop: '20px' }}>Create</button>
    </div>
  );
};

export default CreateGameComponent;
