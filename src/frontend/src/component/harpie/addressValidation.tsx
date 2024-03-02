// AddressValidation.tsx

import React from 'react';
import './addressValidation.css'; // Make sure to create this CSS file

interface AddressValidationProps {
    isMalicious: boolean;
    summary?: string;
    tags?: Record<string, boolean>; // Assuming tags is an object with boolean values
  }
  
  // ...
  
  const AddressValidation: React.FC<AddressValidationProps> = ({ isMalicious, summary, tags }) => {
    const formattedTags = tags ? Object.entries(tags).map(([key, value]) => {
      const formattedKey = key.toLowerCase().replace(/_/g, ' ');
      return `${formattedKey}: ${value ? 'True' : 'False'}`;
    }) : [];
  
    return (
      <div className={`address-validation ${isMalicious ? 'malicious' : 'safe'}`}>
        <p>{isMalicious ? 'Malicious!' : 'Safe, verified by Harpie.'}</p>
        <p>{summary}</p>
        {/* {formattedTags.map((tag, index) => (
          <p key={index}>{tag}</p>
        ))} */}
      </div>
    );
  };

export default AddressValidation;