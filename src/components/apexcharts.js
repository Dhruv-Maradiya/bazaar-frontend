// ** Next Import
import dynamic from "next/dynamic";

// ! To avoid 'Window is not defined' error
const Apexcharts = dynamic(() =>
  import("apexcharts").then((module) => module.default)
);

export default Apexcharts;
