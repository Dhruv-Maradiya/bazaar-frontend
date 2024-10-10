import { useRef, useEffect } from 'react';
import { createChart } from 'lightweight-charts';

const StockChart = ({ candles }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      const chartOptions = {
        layout: {
          textColor: 'white',
          background: {
            type: 'solid',
            color: 'white',
          },
        },
        width: chartContainer.current.clientWidth,
        height: chartContainer.current.clientHeight,
      };

      const chartRef = chartContainer.current;
      const chart = createChart(chartRef, chartOptions);

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#0A9981',
        downColor: '#F23545',
        borderVisible: false,
        wickUpColor: '#0A9981',
        wickDownColor: '#F23545',
      });

      // Check if candles is not undefined or null
      if (candles) {
        // Map the candles data to the format required by lightweight-charts
        const formattedCandles = Object.values(candles).map(candle => ({
          time: candle.startAt.seconds, // Assuming startAt is a Firestore Timestamp
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        // Sort the data by time in ascending order
        formattedCandles.sort((a, b) => a.time - b.time);

        // Set the data for the candlestick series
        candlestickSeries.setData(formattedCandles);

        chart.timeScale().fitContent();
      }

      return () => chart.remove();
    }
  }, [candles]);

  return (
    <div
      ref={chartContainer}
      className='custom-cursor'
      id='stock-chart'
      style={{ width: '100%', height: '400px' }}
    >
    </div>
  );
}

export default StockChart;
