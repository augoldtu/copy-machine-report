import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyChart({ reports }) {

  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค."
  ];

  const monthData =
    new Array(12).fill(0);

  reports.forEach(item => {

    const date =
      new Date(item.date);

    const month =
      date.getMonth();

    monthData[month] +=
      Number(item.quantity || 0);

  });

  const data = {
    labels: months,

    datasets: [
      {
        label: "จำนวนแผ่น",

        data: monthData
      }
    ]
  };

  return <Bar data={data} />;
}

export default MonthlyChart;