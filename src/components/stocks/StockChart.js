import { formatCurr } from "@/utils/format-number";
import { convertFirebaseTimestampToDate } from "@/utils/timestamp";
import { useTheme } from "@mui/material/styles";
import { createChart } from "lightweight-charts";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useResizeDetector } from "react-resize-detector";

const TOOLTIP_WIDTH = 80;
const TOOLTIP_HEIGHT = 120;
const TOOLTIP_MARGIN = 15;

const tooltipContent = (open, high, low, close) => `
  <div class="tooltip-content">
    <div class="tooltip-open">Open: <span class="tooltip-bold">${formatCurr(open)}</span></div>
    <div class="tooltip-high">High: <span class="tooltip-bold">${formatCurr(high)}</span></div>
    <div class="tooltip-low">Low: <span class="tooltip-bold">${formatCurr(low)}</span></div>
    <div class="tooltip-close">Close: <span class="tooltip-bold">${formatCurr(close)}</span></div>
  </div>
`;

const formatCandles = (candles) => {
  return Object.values(candles)
    .map(({ startAt, open, high, low, close }) => {
      const time = moment(convertFirebaseTimestampToDate(startAt));
      const timezoneOffset = time.utcOffset();
      time.add(timezoneOffset, "minutes");

      return {
        time: time.unix(),
        open,
        high,
        low,
        close,
      };
    })
    .sort((a, b) => a.time - b.time);
};

const addCandles = (
  candles,
  chartRef,
  candlestickSeriesRef,
  fitContent = false
) => {
  const formattedCandles = formatCandles(candles);

  if (!chartRef.current || !candlestickSeriesRef.current) return;

  candlestickSeriesRef.current.setData(formattedCandles);
  if (fitContent) chartRef.current.timeScale().fitContent();
};

const createTooltip = (container, theme) => {
  const tooltip = document.createElement("div");
  tooltip.className = "custom-tooltip";
  tooltip.style.backgroundColor = theme.palette.background.default;
  tooltip.style.color = theme.palette.text.primary;
  container.appendChild(tooltip);
  return tooltip;
};

const handleCrosshairMove = (
  param,
  container,
  candlestickSeries,
  tooltipRef
) => {
  const toolTip = tooltipRef.current;

  if (
    param.point === undefined ||
    !param.time ||
    param.point.x < 0 ||
    param.point.x > container.clientWidth ||
    param.point.y < 0 ||
    param.point.y > container.clientHeight
  ) {
    toolTip.style.display = "none";
  } else {
    toolTip.style.display = "block";
    const data = param.seriesData.get(candlestickSeries);
    const price = data.value !== undefined ? data.value : data.close;

    toolTip.innerHTML = tooltipContent(
      data.open,
      data.high,
      data.low,
      data.close
    );

    const coordinate = candlestickSeries.priceToCoordinate(price);
    let shiftedCoordinate = param.point.x - 50;
    if (coordinate === null) {
      return;
    }
    shiftedCoordinate = Math.max(
      0,
      Math.min(container.clientWidth - TOOLTIP_WIDTH, shiftedCoordinate)
    );
    const coordinateY =
      coordinate - TOOLTIP_HEIGHT - TOOLTIP_MARGIN > 0
        ? coordinate - TOOLTIP_HEIGHT - TOOLTIP_MARGIN
        : Math.max(
            0,
            Math.min(
              container.clientHeight - TOOLTIP_HEIGHT - TOOLTIP_MARGIN,
              coordinate + TOOLTIP_MARGIN
            )
          );
    toolTip.style.left = shiftedCoordinate + "px";
    toolTip.style.top = coordinateY + "px";
  }
};

const StockChart = ({ candles, drawerRef }) => {
  const theme = useTheme();
  const chartContainer = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const oldCandles = useRef(null);
  const tooltipRef = useRef(null);

  const { width } = useResizeDetector({
    handleWidth: true,
    targetRef: drawerRef,
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 100,
    skipOnMount: true,
  });

  useEffect(() => {
    if (candles) {
      addCandles(
        candles,
        chartRef,
        candlestickSeriesRef,
        !Boolean(oldCandles.current)
      );
      oldCandles.current = candles;
    }
  }, [candles]);

  useEffect(() => {
    if (!chartContainer.current) return;
    const container = chartContainer.current;

    const chart = createChart(container, {
      layout: {
        background: {
          type: "solid",
          color: theme.palette.background.default,
        },
      },
      grid: {
        vertLines: {
          color: theme.palette.divider,
        },
        horzLines: {
          color: theme.palette.divider,
        },
      },
      timeScale: {
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: theme.palette.divider,
        visible: true,
        timeVisible: true,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
    });

    tooltipRef.current = createTooltip(container, theme);

    chart.subscribeCrosshairMove((param) =>
      handleCrosshairMove(param, container, candlestickSeries, tooltipRef)
    );

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    if (candles) {
      addCandles(candles, chartRef, candlestickSeriesRef, true);
    }

    return () => {
      chart.unsubscribeCrosshairMove();
      chart.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartContainer, width, theme]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: {
            type: "solid",
            color: theme.palette.background.default,
          },
          textColor: theme.palette.text.primary,
          grid: {
            vertLines: {
              color: theme.palette.divider,
            },
            horzLines: {
              color: theme.palette.divider,
            },
          },
        },
      });
    }

    if (tooltipRef.current) {
      tooltipRef.current.style.backgroundColor =
        theme.palette.background.default;
      tooltipRef.current.style.color = theme.palette.text.primary;
    }
  }, [
    theme.palette.background.default,
    theme.palette.divider,
    theme.palette.text.primary,
  ]);

  return (
    <div
      className="custom-cursor"
      ref={chartContainer}
      style={{ height: "400px", width: "100%", position: "relative" }}
    />
  );
};

export default StockChart;
