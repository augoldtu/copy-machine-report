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

function TeacherChart({ reports }) {

  const teacherMap = {};

  reports.forEach(item => {

    if (!teacherMap[item.teacher]) {

      teacherMap[item.teacher] = 0;
    }

    teacherMap[item.teacher] +=
      Number(item.quantity || 0);

  });

  const data = {

    labels:
      Object.keys(teacherMap),

    datasets: [
      {
        label: "จำนวนแผ่น",

        data:
          Object.values(teacherMap)
      }
    ]
  };

  return <Bar data={data} />;
}

export default TeacherChart;