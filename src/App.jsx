import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import "./App.css";
import html2pdf from "html2pdf.js";

import MonthlyChart from "./components/MonthlyChart";
import TeacherChart from "./components/TeacherChart";

function App() {

  const [teacher, setTeacher] = useState("");
  const [action, setAction] = useState("");
  const [detail, setDetail] = useState("");
  const [quantity, setQuantity] = useState("");

  const [showChart, setShowChart] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reports, setReports] = useState([]);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const [loading, setLoading] = useState(true);

  const handleSave = async () => {

    if (
  !teacher ||
  !action ||
  !quantity
) {
  alert("กรุณากรอกข้อมูลให้ครบ");
  return;
}

  const formData = {
    teacher,
    action,
    detail,
    quantity
  };

  try {

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzV5jdz55k4gB8LQZ0zxhilZsUeDn84SyYqKylzGB7ACBfHYyquVOrL3tqkhU168K8x/exec",
      {
        method: "POST",
        body: JSON.stringify(formData)
      }
    );

    const result =
      await response.json();

    console.log(result);

    alert("บันทึกข้อมูลสำเร็จ");
    loadReports();

    setTeacher("");
    setAction("");
    setDetail("");
    setQuantity("");

  } catch (error) {

    console.error(error);

    alert("เกิดข้อผิดพลาด");
  }
};

const loadReports = () => {

  console.log("กำลังโหลดข้อมูล...");

  setLoading(true);

  fetch(
    "https://script.google.com/macros/s/AKfycbzV5jdz55k4gB8LQZ0zxhilZsUeDn84SyYqKylzGB7ACBfHYyquVOrL3tqkhU168K8x/exec"
  )
    .then(res => res.json())
    .then(data => {

      console.log("ข้อมูลที่ได้รับ =", data);

      setReports(data);

      setLoading(false);

    })
    .catch(err => {

      console.error("ERROR =", err);

      setLoading(false);

    });

};

  useEffect(() => {

  loadReports();

}, []);

  const filteredReports = reports.filter(item => {

  if (!item.date) return false;

  const itemDate = new Date(item.date);

  const itemMonth =
    itemDate.getFullYear() * 100 +
    (itemDate.getMonth() + 1);

  const start =
    startMonth
      ? Number(startMonth.replace("-", ""))
      : 0;

  const end =
    endMonth
      ? Number(endMonth.replace("-", ""))
      : 999999;

  return (
    itemMonth >= start &&
    itemMonth <= end
  );

});

const totalJobs = filteredReports.length;

const totalSheets = filteredReports.reduce(
  (sum, item) => sum + Number(item.quantity || 0),
  0
);

const totalTeachers = new Set(
  filteredReports.map(item => item.teacher)
).size;

console.log("reports =", reports);
console.log("totalJobs =", totalJobs);
console.log("totalSheets =", totalSheets);
console.log("totalTeachers =", totalTeachers);

const teachers = [
  "นางรุ่งระวี บุษบงค์",
  "นางสาวชนาภา จันทรานุสรณ์",
  "นางสิริรัตน์ ศรีกาญจนวงษ์ ",
  "นางณัฐหทัย บงเรือน ",
  "ว่าที่ร้อยตรีหญิงนงค์นุช สิงห์ทอง ",
  "นายเนรมิต เหล็กคงสันเทียะ",
  "นางสาววทันยา คำคง ",
  "นางสาวศันสนีย์ ยอดดำเนิน ",
  "นางสาวฤดีรัตน์ อยู่อาจิน ",
  "นางสาวพชรมณฑน์ นาคเสน",
  "นางสาวชรินทร์ธร สุพรรณกูล ",
  "นางสาวศรีนาถ สาสดี",
  "นางสาวสิรารัตน์ เอี่ยมคุ้ม ",
  "นางสาวภัทรพร  วังคะฮาด",
  "นางสาวสุภาวิดา อินทร์นิ่ม ",
  "นางสาวเมย์  สุขรักษ์ ",
  "นายสุชาติ คชรักษ์ ",
  "นางสาวนปภา จีนสมัย ",
  "นางสาวดาราเรศ โพธิ์ปาน ",
  "นายเรวัต คนธาร์"
];

  const exportPDF = async () => {

  if (reports.length === 0) {

    alert("ยังไม่มีข้อมูล");

    return;

  }

  // รอ React render ให้เสร็จก่อน
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  const element =
    document.getElementById("pdf-report");

  if (!element) {

    alert("ไม่พบรายงาน");

    return;

  }

  const options = {

    margin: 10,

    filename:
      "รายงานการใช้เครื่องถ่ายเอกสาร.pdf",

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
      scale: 2,
      useCORS: true
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape"
    }

  };

  html2pdf()
    .set(options)
    .from(element)
    .save();

};

  return (
    <div className="container">
      <img
      src="/logo.png"
      alt="school logo"
      className="footer-logo"
    />

      <h1>📋 COPYLOG</h1>

      <div className="form-card">

        <label>ชื่อครู</label>

        <select
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        >
          <option value="">เลือกครู</option>
          {teachers.map((teacherName) => (

  <option
    key={teacherName}
    value={teacherName}
  >
    {teacherName}
  </option>

))}
        </select>

        <label>ประเภทงาน</label>

        <input
          type="text"
          placeholder="เช่น ข้อสอบ ใบงาน เอกสารราชการ"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />

        <label>รายละเอียด</label>

        <input
          type="text"
          placeholder="รายละเอียดเพิ่มเติม"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        <label>จำนวนแผ่น</label>

        <input
          type="number"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button
          className="save-btn"
          onClick={handleSave}
        >
          💾 บันทึก
        </button>

        <div className="action-buttons">

          <button
            className="view-btn"
            onClick={() => setShowChart(!showChart)}
          >
          📊 ดูกราฟ
          </button>

          <button
            className="view-btn"
            onClick={() => setShowReport(!showReport)}
          >
          📄 ดูรายงาน
          </button>
          
          <button
  className="view-btn"
  onClick={exportPDF}
>
  📄 Export PDF
</button>

        <button
  className="view-btn"
  onClick={loadReports}
>
  🔄 รีเฟรชข้อมูล
</button>

        </div>
          {showChart && (
  <div className="section-box report-section">
    <h2>📊 กราฟสรุป</h2>

    <h3>กราฟรายเดือน</h3>

<MonthlyChart reports={filteredReports} />

<br />

<h3>กราฟแยกตามครู</h3>

<TeacherChart reports={filteredReports} />
  </div>
)}
<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  }}
>

  <div>

    <label>เดือนเริ่มต้น</label>

    <input
      type="month"
      value={startMonth}
      onChange={(e) =>
        setStartMonth(e.target.value)
      }
    />

  </div>

  <div>

    <label>เดือนสิ้นสุด</label>

    <input
      type="month"
      value={endMonth}
      onChange={(e) =>
        setEndMonth(e.target.value)
      }
    />

  </div>

</div>
 {showReport && (
  <div
    id="pdf-report"
    className="section-box report-area"
  >

    <div className="report-header">
    
<img
      src="/logo.png"
      alt="school logo"
      className="footer-logo"
    />

  <h2>
    โรงเรียนบ้านหนองตะขบ
  </h2>

  <h3>
    รายงานการใช้เครื่องถ่ายเอกสาร
  </h3>

  <p>
    วันที่ออกรายงาน :
    {new Date().toLocaleDateString("th-TH")}
  </p>

</div>

    <div className="dashboard-cards">

  <div className="card">

    <h3>📋 งานทั้งหมด</h3>

    <h1>{totalJobs}</h1>

  </div>

  <div className="card">

    <h3>📄 แผ่นรวม</h3>

    <h1>{totalSheets}</h1>

  </div>

  <div className="card">

    <h3>👨‍🏫 ครูทั้งหมด</h3>

    <h1>{totalTeachers}</h1>

  </div>

</div>

    <table className="report-table">

      <thead>

        <tr>
  <th>วันที่</th>
  <th>ครู</th>
  <th>ประเภทงาน</th>
  <th>รายละเอียด</th>
  <th>จำนวนแผ่น</th>
</tr>

      </thead>

      <tbody>

        {filteredReports.map((item, index) => (

          <tr key={index}>

  <td>
  {item.date
    ? new Date(item.date).toLocaleString("th-TH")
    : "-"}
</td>

  <td>{item.teacher}</td>

  <td>{item.action}</td>

  <td>{item.detail}</td>

  <td>{item.quantity}</td>

</tr>

        ))}

      </tbody>

    </table>

<div className="signature-box">

  <br />
  <br />
  <br />

  <p>
    ลงชื่อ ....................................
  </p>

  <p>
    (..........................................)
  </p>

  <p>
    ผู้จัดทำรายงาน
  </p>

</div>

  </div>
)}     

      </div>
      <footer className="footer-credit">

  <div className="footer-box">

    <img
      src="/logo.png"
      alt="school logo"
      className="footer-logo"
    />

    <div>
      <p className="footer-title">
        🏫 โรงเรียนบ้านหนองตะขบ
      </p>

      <p>
        ระบบบันทึกการใช้งานเครื่องถ่ายเอกสาร
      </p>

      <p>
        ผู้พัฒนา: นายเนรมิต เหล็กคงสันเทียะ
      </p>

      <p>
        Version: v1.0 | ปีการศึกษา 2569
      </p>

    </div>

  </div>

</footer>
    </div>
  );
}

export default App;