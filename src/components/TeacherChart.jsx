import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function TeacherChart({ reports }) {

  const teacherData = {};

  reports.forEach(item => {

    const teacher = item.teacher;

    teacherData[teacher] =
      (teacherData[teacher] || 0) +
      Number(item.quantity || 0);

  });

  const data = Object.keys(teacherData).map(
    teacher => ({
      name: teacher,
      value: teacherData[teacher]
    })
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA66CC",
    "#FF6699"
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (

            <Cell
              key={index}
              fill={
                COLORS[
                  index % COLORS.length
                ]
              }
            />

          ))}
        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>
    </ResponsiveContainer>
  );
}

export default TeacherChart;