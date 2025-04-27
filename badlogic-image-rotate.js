/**=======================================================================================
 * BadLogicRotate
 * 
 * 
 * Copyright (c) 2025, 
 *======================================================================================*/
/**=======================================================================================
*BadLogicRotate: A dynamic tool designed to handle image rotation seamlessly, enabling users to easily rotate images 
*and manage transformations within a web interface. The concept and development of this tool were inspired by collaboration with ChatGPT 
and Tao, who provided essential insights and guidance in its creation.
 *  ChatGPT 99.99
 *  Tao     00.01 
 
 
 <div id="cameraArea"></div>

<script>
    BadLogicRotate.init("cameraArea", {
        videoWidth: "100%",
        buttonClass: "btn btn-primary",
        captureText: "ถ่ายภาพ",
        pdfText: "รวม PDF",
        pdfName: "ตั้งชื่อ  pdf เอง",
        cancelText: "ปิดกล้อง",
        imagePreviewWidth: "120px",
        inputFileId: "uploadFileInput",  
        download:  options.download || "true or false",// <<<<--- ส่ง id ของ input ไฟล์มา
        cameraButtonId: options.cameraButtonId || "openCameraButton"  // เพิ่ม cameraButtonId,
        onStart: options.onStart || function() {},  // callback เมื่อเริ่มโปรแกรม
        onCancel: options.onCancel || function() {},  // callback เมื่อกดยกเลิก
        onGeneratePdf: options.onGeneratePdf || function() {},  // callback เมื่อกดรวมภาพ  // เพิ่ม cameraButtonId
        onCapture: options.onCapture || function() {}  // callback เมื่อกด Capture
    });
</script>
 
 *======================================================================================*/
 
 const BadLogicRotate = {
    init(targetDivId, options = {}) {
        const container = document.getElementById(targetDivId);
        if (!container) {
            console.error("BadLogicRotate: Target div not found:", targetDivId);
            return;
        }

        // Initialize properties
        this.divCount = 0;
        this.cameraOpened = false;
        this.base64Images = {}; // เก็บข้อมูลต้นฉบับ


        // Default options
        this.options = {
            videoWidth: options.videoWidth || "100%",
            buttonClass: options.buttonClass || "btn btn-primary",
            captureText: options.captureText || "ถ่ายรูป",
            pdfText: options.pdfText || "รวมเป็น PDF",
            pdfName: options.pdfName,
            cancelText: options.cancelText || "ยกเลิก",
            imagePreviewWidth: options.imagePreviewWidth || "100px",
            inputFileId: options.inputFileId || "badlogic-upload-input",
            download:  options.download,
            cameraButtonId: options.cameraButtonId || "openCameraButton",
            onStart: options.onStart || function () {},
            onCancel: options.onCancel || function () {},
            onGeneratePdf: options.onGeneratePdf || function () {},
            onCapture: options.onCapture || function () {}
        };

        container.innerHTML = `
            <div class="camera-controls">
                <video id="cameraFeed" autoplay style="width:${this.options.videoWidth};"></video>
                <br><br>
                <div class="camera-buttons">
                    <a href="#" id="captureButton" class="${this.options.buttonClass}">${this.options.captureText}</a>
                    <a href="#" id="generatePdfButton" class="${this.options.buttonClass}">${this.options.pdfText}</a>
                    <a href="#" id="closeButton" class="btn btn-light">${this.options.cancelText}</a>
                    <input type="file" accept="image/*" id="${this.options.inputFileId}" style="display:none;">
                </div>
            </div>
            <br>
            <div class="photo-display">
                <canvas id="photoCanvas" style="width:100%; border: 1px solid #ccc;"></canvas>
                <div class="row" id="card-drag-area"></div>
            </div>
        `;

        this.setupEvents();
    },

    setupEvents() {
        document.getElementById(this.options.cameraButtonId).addEventListener("click", () => {
            this.camera();
        });

        document.getElementById("closeButton").addEventListener("click", () => {
            this.close();
        });

        // ย้ายการกำหนด event listener สำหรับ captureButton มาที่นี่
        document.getElementById("captureButton").addEventListener("click", () => {
            this.capture();
        });
        
                // ย้ายการกำหนด event listener สำหรับ captureButton มาที่นี่
        document.getElementById("generatePdfButton").addEventListener("click", () => {
            this.generatePdf();
        });
        
        
    },

    camera() {
        this.options.onStart();

        if (!this.cameraOpened) {
            this.cameraOpened = true;
            const cameraFeed = document.getElementById('cameraFeed');

            // เปิดกล้อง
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    cameraFeed.srcObject = stream;
                })
                .catch((error) => {
                    console.error('เกิดข้อผิดพลาดในการเข้าถึงกล้อง: ', error);
                });
        }
    },

    capture() {
	
	    this.options.onCapture();
        const cameraFeed = document.getElementById('cameraFeed');
        const photoCanvas = document.getElementById('photoCanvas');

        // เรียก createNewDiv
        this.createNewDiv();

        // แสดง canvas และจับภาพจากกล้อง
        photoCanvas.style.display = 'block';
        const context = photoCanvas.getContext('2d');

        // กำหนดขนาดของ canvas ให้ตรงกับขนาดของกล้อง
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;

        // วาดภาพจากกล้องลงบน canvas
        context.drawImage(cameraFeed, 0, 0, cameraFeed.videoWidth, cameraFeed.videoHeight);

        // จัดการแสดงผลของรูปภาพ
        const capturedPhoto = document.getElementById("capturedPhoto" + this.divCount);
        capturedPhoto.src = photoCanvas.toDataURL('image/png'); // แปลงภาพจาก canvas เป็น base64
        capturedPhoto.style.display = 'block'; // แสดงรูปภาพ
        capturedPhoto.style.width = '100%'; // ทำให้รูปภาพเต็มขนาดของพื้นที่

        // ซ่อน canvas หลังจากจับภาพ
        photoCanvas.style.display = 'none';
    },

    stopCamera() {
        if (this.cameraOpened) {
            const cameraFeed = document.getElementById('cameraFeed');
            const stream = cameraFeed.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop()); // หยุดทุกแทร็กของวิดีโอ
                cameraFeed.srcObject = null; // ล้าง srcObject
            }
            this.cameraOpened = false; // อัปเดตสถานะกล้อง
        }
    },

    close() {
        this.stopCamera();
        this.options.onCancel();
    },

    createNewDiv() {
        const cardDragArea = document.getElementById("card-drag-area");
        if (!cardDragArea) {
            console.error("card-drag-area not found");
            return;
        }

        this.divCount++; // เพิ่มจำนวน div

        const newDiv = document.createElement("div");
        newDiv.className = "col-xl-4 col-md-4 col-sm-4 draggable";
        newDiv.id = "card" + this.divCount; // เพิ่ม id ตามลำดับ

        newDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">Card ${this.divCount}</h4>
                    <span>
                    <a href="#" onclick="BadLogicRotate.Invert(${this.divCount})">🔄</a>
                     <a href="#" onclick="BadLogicRotate.deleteCard(this)" style="color:red">❌</a>
                     </span>
                </div>
                <div class="card-body">
                    <img id="capturedPhoto${this.divCount}" class="capture" style="width:100%;float:left;margin-left:5px" alt="รูปถ่าย">
                </div>
            </div>
        `;

        cardDragArea.appendChild(newDiv); // เพิ่ม div ใหม่ลงใน card-drag-area
    }
    
    
    ,deleteCard(button) {
        const cardDiv = button.closest('.draggable');
        if (cardDiv) {
            cardDiv.remove(); // ลบ div ที่คลิกออกไป
        }
    }
    
    
    ,Invert(button) {
	
        var base64Images = this.base64Images;
        var capturedPhoto = document.getElementById("capturedPhoto" + button);

        if (!base64Images[button]) {
            base64Images[button] = {
                originalSrc: capturedPhoto.src,
                rotation: 0
            };
        }

        base64Images[button].rotation = (base64Images[button].rotation + 90) % 360;
        const newAngle = base64Images[button].rotation;

        const img = new Image();
        img.src = base64Images[button].originalSrc;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (newAngle === 90 || newAngle === 270) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ย้าย origin ไปกึ่งกลาง canvas
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((newAngle * Math.PI) / 180);

            // สำคัญตรงนี้: วาดเต็ม canvas ใหม่!
            ctx.drawImage(
                img,
                -img.width / 2, // ติดลบครึ่งหนึ่ง
                -img.height / 2, 
                img.width,       // ขยายเต็มขนาดเดิม
                img.height
            );

            capturedPhoto.src = canvas.toDataURL("image/png");
        };
    }
    
    
    ,generatePdf() {
	
	
	   this.options.onGeneratePdf();
	   window.jsPDF = window.jspdf.jsPDF;
	
	
		 if (!window.jspdf || !window.jspdf.jsPDF) {
	            console.error("jsPDF library is not loaded");
	            return;
	        }
		
		
		
		  const doc = new jsPDF();

        let yOffset = 10;

        
        const elementsWithClass = document.querySelectorAll('.capture');

     // สร้างอาร์เรย์สำหรับเก็บค่า src
     var base64Images = [];

 
     var i = 0;
     // วนลูปผ่านองค์ประกอบที่มีคลาส
     elementsWithClass.forEach(element => {
         const src = element.getAttribute('src');
         if (src.startsWith('data:image') || src.startsWith('blob:')) {
        	i++;
        	 const currentRotation = element.style.transform || "rotate(0deg)";
        	 console.error('Invalid i ', i);
           //  base64Images.push(src);
             base64Images.push({ src: src, rotation: currentRotation });
             
         } else {
             console.error('Invalid image src:', src);
         }
     });
        

     if (base64Images.length === 0) {
         console.error('No images found');
     }

     base64Images.forEach(imageData => {
          const img = new Image();
        
  
          img.src = imageData.src;
          var imageBase64 = imageData.src;

          
          
         
   
        	  var maxWidth = doc.internal.pageSize.getWidth();
              var maxHeight = doc.internal.pageSize.getHeight();

              var imgWidth = img.width;
              var imgHeight = img.height;

              
              console.log(" IMG "+img.width);
              
              var width, height;
              var page = null;

              // คำนวณอัตราส่วนความกว้างและความสูง
              const aspectRatio = imgWidth / imgHeight;

              // ถ้าภาพกว้างเกินความกว้างของหน้า PDF ให้ย่อความกว้าง
              if (imgWidth > imgHeight) {
                  page = "l";
                  width = 278;
                  height = width / aspectRatio; // แก้จาก imgWidth เป็น width
              } else {
                  width =maxWidth;
                  height = maxHeight;
              }




              // เพิ่มหน้าใหม่สำหรับรูปถัดไป
              if (page === 'l') {
                  doc.addPage(null, 'l');
                  // เพิ่มภาพลงใน PDF
                  doc.addImage(imageBase64, "PNG", 10, 10, width, height - 20);
              } else {
                  doc.addPage();
                  // เพิ่มภาพลงใน PDF
                  doc.addImage(imageBase64, "PNG", 10, 10, width- 20, height);
              }
        
          
          
        });
        doc.deletePage(1);
        // สร้าง URL ของเอกสาร PDF
        const pdfDataUri = doc.output('datauristring');


        
        
        const base64Data = pdfDataUri; // Your Base64 PDF data here

     // Create a Blob from the Base64 data
     const byteCharacters = atob(base64Data.split(',')[1]);
     const byteArrays = [];

     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
       const slice = byteCharacters.slice(offset, offset + 512);

       const byteNumbers = new Array(slice.length);
       for (let i = 0; i < slice.length; i++) {
         byteNumbers[i] = slice.charCodeAt(i);
       }

       const byteArray = new Uint8Array(byteNumbers);
       byteArrays.push(byteArray);
     }

     const blob = new Blob(byteArrays, { type: 'application/pdf' });
        
        
   if (this.options.download == true ) {     
	    const downloadLink = document.createElement('a');
	    downloadLink.href = URL.createObjectURL(blob);
	    downloadLink.download = 'output.pdf';
	     downloadLink.click();
    }
     
     
     
	if (!this.options.inputFileId ) {
	            console.error("inputFileId is Not found ");
	         
	  }else{
	var inp  = document.getElementById(this.options.inputFileId);
	const dT = new DataTransfer();
	
	  const pdf_name = this.options.pdfName == null ? 'created_auto.pdf' : this.options.pdfName;
      const file = new File([blob],pdf_name, { type: 'application/pdf' });

      // เพิ่มไฟล์ลงใน DataTransfer
      dT.items.add(file);

      // อัพเดตไฟล์ใน input file
      inp.files = dT.files;
		
	}
      
  
        
	
	}
    
    
};


