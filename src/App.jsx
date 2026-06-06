import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import "./App.css";

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

  setLoading(true);   // 👈 ใส่ตรงนี้ (ก่อน fetch)

  fetch("https://script.google.com/macros/s/AKfycbzV5jdz55k4gB8LQZ0zxhilZsUeDn84SyYqKylzGB7ACBfHYyquVOrL3tqkhU168K8x/exec")
    .then(res => res.json())
    .then(data => {

      setReports(data);
      setLoading(false);  // 👈 โหลดเสร็จปิด

    })
    .catch(err => {

      console.error(err);
      setLoading(false);  // 👈 กันค้าง

    });

};

  useEffect(() => {

  loadReports();

}, []);
const [readyToExport, setReadyToExport] = useState(false);
const totalJobs = reports.length;

const totalSheets = reports.reduce(
  (sum, item) =>
    sum + Number(item.quantity || 0),
  0
);

const totalTeachers =
  new Set(
    reports.map(item => item.teacher)
  ).size;

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
  "นางสาวสุภาวิดา เล็กฉลาด ",
  "นางสาวเมย์  สุขรักษ์ ",
  "นายสุชาติ คชรักษ์ ",
  "นางสาวนปภา จีนสมัย ",
  "เลย์"
];

  const exportPDF = async () => {
setReadyToExport(true);
  setShowReport(true);

  // ⛔ รอ React render จริง (สำคัญมาก)
  await new Promise(resolve => setTimeout(resolve, 300));

  const reportElement =
    document.getElementById("pdf-report");

  if (!reportElement) {
    alert("ไม่พบรายงาน");
    return;
  }

  const canvas =
    await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      scrollY: 0
    });

  const imgData =
    canvas.toDataURL("image/png");

  const pdf =
    new jsPDF("p", "mm", "a4");

  const pdfWidth =
    pdf.internal.pageSize.getWidth();

  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save("รายงานถ่ายเอกสาร.pdf");
};

  return (
    <div className="container">

      <h1>📋 บันทึกการใช้งานเครื่องถ่ายเอกสาร</h1>

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

<MonthlyChart reports={reports} />

<br />

<h3>กราฟแยกตามครู</h3>

<TeacherChart reports={reports} />
  </div>
)}

 {showReport && (
  <div
    id="pdf-report"
    className="section-box report-area"
  >

    <div className="report-header">

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

        {reports.map((item, index) => (

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
        Version: v1.0 | ปีการศึกษา 2568
      </p>

    </div>

  </div>

</footer>
    </div>
  );
}

export default App;