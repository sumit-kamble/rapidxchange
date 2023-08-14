import React, { useState, useEffect } from 'react';

const RupeeToEtherConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [etherAmount, setEtherAmount] = useState('');
  const [conversionRate, setConversionRate] = useState('');

  useEffect(() => {
    fetchConversionRate();
  }, []);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
      );
      const data = await response.json();
      setConversionRate(data.ethereum.inr);
    } catch (error) {
      console.log('Error fetching conversion rate:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (conversionRate && inputValue) {
      const rupeeAmount = parseFloat(inputValue);
      const etherValue = rupeeAmount / conversionRate;
      setEtherAmount(etherValue.toFixed(6)); // Limit to 6 decimal places
    } else {
      setEtherAmount('');
    }
  }, [conversionRate, inputValue]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-4">Indian Rupee to Ether Converter</h2>
        <div className="mb-4">
          <label htmlFor="rupee-input" className="text-lg">
            Enter INR amount:
          </label>
          <input
            id="rupee-input"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            className="px-2 py-1 ml-2 rounded-md bg-white text-gray-800"
          />
        </div>
        {conversionRate && inputValue && (
          <p className="text-lg">
            With {inputValue} INR, you can buy approximately {etherAmount} ETH.
          </p>
        )}
      </div>
    </div>
  );
};

export default RupeeToEtherConverter;
