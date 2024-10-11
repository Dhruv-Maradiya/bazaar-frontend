import { useRef, useEffect } from 'react';
import { createChart } from 'lightweight-charts';

const StockChart = ({ candles }) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (!chartContainer.current) return;

    const chart = createChart(chartContainer.current, {
      layout: { textColor: 'white', background: { color: 'white' } },
      width: chartContainer.current.clientWidth,
      height: chartContainer.current.clientHeight,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      // color scheme as per trading view chart ~~ color codes
      upColor: '#0A9981', downColor: '#F23545',
      wickUpColor: '#0A9981', wickDownColor: '#F23545',
    });

    if (candles) {

      // Convert candles object into array of values..
      const formattedCandles = Object.values(candles)
        .map(({ startAt, open, high, low, close }) => ({
          time: startAt.seconds, open, high, low, close
        }))
        .sort((a, b) => a.time - b.time);

      candlestickSeries.setData(formattedCandles);
      chart.timeScale().fitContent();
    }

    return () => chart.remove();
  }, [candles]);

  return (
    <div className="custom-cursor" ref={chartContainer} style={{ width: '100%', height: '400px' }} />
  );
};

export default StockChart;
