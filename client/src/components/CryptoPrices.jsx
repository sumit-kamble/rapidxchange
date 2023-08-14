import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoPrices = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coincap.io/v2/assets', {
          params: {
            ids: 'bitcoin,ethereum',
          },
        });
        const dataWithTimestamp = response.data.data.map((crypto) => ({
          ...crypto,
          timestamp: new Date().toLocaleString(),
        }));
        setPrices(dataWithTimestamp);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchData();
    // Fetch prices every 10 seconds
    const interval = setInterval(fetchData, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const convertToINR = (priceUSD) => {
    // Replace with the current USD to INR conversion rate
    const conversionRate = 74.5;
    const priceINR = priceUSD * conversionRate;
    return priceINR.toFixed(2); // Limit to two decimal places
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-black">
      <div className="container mx-auto mt-0 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">Crypto Prices</h1>
        <ul className="grid grid-cols-2 gap-4">
          {prices.map((crypto) => (
            <li
              key={crypto.id}
              className="p-6 bg-white bg-opacity-75 shadow-md rounded-lg text-xl text-center text-gray-800"
            >
              <span className="font-semibold block">{crypto.name}</span>
              <span className="text-3xl block mt-4">₹{convertToINR(crypto.priceUsd)}</span>
              <span className="text-gray-500 text-sm mt-2 block">(Fetched at {crypto.timestamp})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CryptoPrices;

