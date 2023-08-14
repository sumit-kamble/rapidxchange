import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const CryptoChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
          params: {
            vs_currency: 'usd',
            days: '7',
          },
        });
        const { prices } = response.data;
        const chartData = {
          labels: prices.map((price) => new Date(price[0]).toLocaleDateString()),
          datasets: [
            {
              label: 'Bitcoin Price (USD)',
              data: prices.map((price) => price[1]),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        };
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching crypto chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Crypto Live Chart</h1>
      <div>
        {Object.keys(chartData).length > 0 ? (
          <Line data={chartData} options={{ responsive: true }} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default CryptoChart;
