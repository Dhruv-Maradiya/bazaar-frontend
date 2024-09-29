import { convertFirebaseTimestampToDate } from "@/utils/timestamp";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";

const StockChart = () => {
  const theme = useTheme();
  const candles = useSelector((state) => state.firestore.ordered.candles);
  const apexChart = useRef(null);
  const chartRef = useRef(null);
  const zoomRef = useRef(null);

  const series = useMemo(() => {
    if (!candles) return [];

    return candles.map((candle) => ({
      x: convertFirebaseTimestampToDate(candle.startAt),
      y: [candle.open, candle.high, candle.low, candle.close],
    }));
  }, [candles]);

  const options = useMemo(() => {
    return {
      chart: {
        type: "candlestick",
        height: 400,
        background: "transparent",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        events: {
          beforeResetZoom: function () {
            zoomRef.current = null;
          },
          zoomed: function (_, value) {
            zoomRef.current = [value.xaxis.min, value.xaxis.max];
          },
        },
      },
      tooltip: {
        enabled: true,
        x: {
          format: "dd MMM yyyy, HH:mm",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: function (val) {
            return new Date(val).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
      grid: {
        borderColor: theme.palette.divider,
      },
      theme: {
        mode: theme.palette.mode,
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: theme.palette.success.main,
            downward: theme.palette.error.main,
          },
        },
      },
      series: [
        {
          data: [],
        },
      ],
    };
  }, [
    theme.palette.divider,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.mode,
  ]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      chartRef.current &&
      !apexChart.current
    ) {
      const ApexChartsConstructor = require("apexcharts");

      apexChart.current = new ApexChartsConstructor(chartRef.current, options);
      apexChart.current.render();
    }
  });

  useEffect(() => {
    const chart = apexChart.current;

    if (chart) {
      chart.updateOptions({
        theme: {
          mode: theme.palette.mode,
        },
        grid: {
          borderColor: theme.palette.divider,
        },
        series: [{ data: series }],
      });

      if (zoomRef.current) {
        chart.zoomX(zoomRef.current[0], zoomRef.current[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (apexChart.current) {
      const chart = apexChart.current;

      chart.updateOptions(
        {
          series: [{ data: series }],
        },
        false,
        false,
        false
      );

      if (zoomRef.current) {
        chart.zoomX(zoomRef.current[0], zoomRef.current[1]);
      }
    }
  }, [series]);

  if (!candles) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <div ref={chartRef}></div>
    </Box>
  );
};

export default StockChart;
