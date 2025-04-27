# BadLogicRotate

BadLogicRotate เป็นเครื่องมือที่ช่วยให้การถ่ายภาพ, หมุนภาพ, และจัดการไฟล์รูปภาพในเว็บแอปพลิเคชันสะดวกขึ้น โดยรองรับการถ่ายภาพจากกล้อง, หมุนภาพ, และแสดงตัวอย่างภาพอย่างง่ายดาย รวมถึงแปลงเป็นไฟล์ PDF และดาวน์โหลดหรือนำเข้า input file ได้ง่าย ๆ เพียงนำเข้าไลบรารี jspdf.umd.min.js

## คุณสมบัติ
- ถ่ายภาพจากกล้อง
- หมุนภาพ
- แสดงตัวอย่างภาพ
- แปลงเป็น PDF และดาวน์โหลด
- นำไฟล์ PDF เข้า input file

## การติดตั้ง
รวมไลบรารี jsPDF ใน HTML:

```html
<div id="formss">
 <a href="#" class="btn btn-light me-1 waves-effect waves-float waves-light" id="opencamera">Open camera</a>
 <input type="file" name="file1" id="uploadFileInput" class="form-control">
</div>
<div id="cameraArea"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="BadLogicRotate/badlogic-image-rotate.js"></script>
<script>
    BadLogicRotate.init("cameraArea", {
        videoWidth: "100%",
        buttonClass: "btn btn-primary",
        captureText: "ถ่ายภาพ",
        pdfText: "รวม PDF",
        cancelText: "ปิดกล้อง",
        imagePreviewWidth: "120px",
        inputFileId: "uploadFileInput",
        cameraButtonId: "opencamera",
        download: true,
        onStart: function() {
            $("#cameraArea").toggle();
            $("#formss").toggle();
        },
        onCancel: function() {
            $("#cameraArea").toggle();
            $("#formss").toggle();
        },
        onCapture: function() {},
        onGeneratePdf: function() {
            $("#cameraArea").toggle();
            $("#formss").toggle();
        }
    });
</script>
