import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportCardPage = () => {
  const contentRef = useRef(null);

  const handleConvertToPDF = async () => {
    if (contentRef.current) {
      try {
        const content = contentRef.current;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210; // A4 page width in mm
        const pageHeight = 297; // A4 page height in mm
        const contentWidth = content.clientWidth;
        const contentHeight = content.clientHeight;
        const pdfScale = pageWidth / contentWidth;
        const pageData = content.cloneNode(true);
        const numPages = Math.ceil(contentHeight / pageHeight);
  
        const promises = [];
  
        for (let i = 0; i < numPages; i++) {
          const pdfPage = document.createElement('div');
          pdfPage.style.width = contentWidth + 'px';
          pdfPage.style.height = contentHeight + 'px';
          pdfPage.appendChild(pageData);
  
          if (i > 0) {
            pdfPage.style.marginTop = `-${pageHeight * i * pdfScale}mm`;
          }
  
          pdf.addPage();
  
          const canvas = await html2canvas(pdfPage, { scale: pdfScale });
          const dataUrl = canvas.toDataURL('image/png');
  
          // Handle any additional processing of canvas, if needed
  
          promises.push(new Promise((resolve) => {
            pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
            resolve();
          }));
        }
  
        await Promise.all(promises);
  
        pdf.save('ReportCard.pdf');
      } catch (error) {
        console.error('Error capturing content:', error);
      }
    }
  };
  



    // Attach an event listener to the button to trigger PDF conversion
   



  return (
    <div ref={contentRef} style={{ width: '100%', height: '100%' }} className="thediv container text-sm w-full  h-full overflow-y-auto pb-40">
      <div class="container w-full  overflow-y-auto flex flex-col items-center justify-center">

      <button onClick={handleConvertToPDF} id="convertButton">Convert to PDF and Download</button>


      <img src="./Assets/logo.png" className="rounded-full w-20 mx-auto m-4"/>
      
        <h1 class="text-4xl font-bold mb-4">CrestHive International School</h1>
        <h3 class="text-2xl font-bold mb-8">Report Card</h3>

        <div class="flex flex-col w-full px-4 md:px-40">
          <div class="flex flex-1 flex-row items-center justify-between border-b border-gray-200 pb-4">
            <span class="font-bold">Name of the Student:</span>
            <span class="text-gray-700">Brandom Boyd</span>
          </div>

          <div className="flex mt-6 w-full">
            <div class="flex mr-8 flex-1 flex-row items-center justify-between border-b border-gray-200 py-4">
              <span class="font-bold">Grade/Year:</span>
              <span class="text-gray-700">6</span>
            </div>

            <div class="flex mx-8 flex-1 flex-row items-center justify-between border-b border-gray-200 py-4">
              <span class="font-bold">Class Advisor:</span>
              <span class="text-gray-700">Ms. Adelle Lim</span>
            </div>
          </div>

          <div className="flex mb-8 w-full">
            <div class="flex mr-8 flex-1 flex-row items-center justify-between border-b border-gray-200 py-4">
              <span class="font-bold">School Year:</span>
              <span class="text-gray-700">2023-2024</span>
            </div>

            <div class="flex mx-8 flex-1 flex-row items-center justify-between border-b border-gray-200 py-4">
              <span class="font-bold">Pod/Section:</span>
              <span class="text-gray-700">Charity</span>
            </div>
          </div>

          <table class="mt-6 border-separate border-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 font-bold bg-gray-100">Subjects</th>
                <th class="px-4 py-2 font-bold bg-gray-100">Test score</th>
                <th class="px-4 py-2 font-bold bg-gray-100">Exam score</th>
                <th class="px-4 py-2 font-bold bg-gray-100">Total score</th>
                <th class="px-4 py-2 font-bold bg-gray-100">Grade</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td class="px-4 py-2 text-gray-700">Science</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>
              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">Algebra</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">Language</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">English Literature</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">History</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">Writing</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">Computer Science</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>
              <tr>
                <td class="px-4 py-2 text-gray-700">Physical Education</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">
                  Training Learning Education
                </td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">Music</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>

              <tr>
                <td class="px-4 py-2 text-gray-700">Arts</td>
                <td class="px-4 py-2 text-gray-700">25</td>
                <td class="px-4 py-2 text-gray-700">64</td>
                <td class="px-4 py-2 text-gray-700">89</td>
                <td class="px-4 py-2 text-gray-700">A+</td>              </tr>
            </tbody>
          </table>

          <div className="flex mt-6 w-full">
            <div className="flex-1 w-full gap-8">
              <table class="mt-8 w-full flex-col border-separate border-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 text-left flex-1 items-left py-2 font-bold bg-gray-100">
                      Attendance
                    </th>
                    <th class="px-4 flex-1 w-fit text-left  py-2 font-bold bg-gray-100">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td class="px-4 py-2 text-gray-700">Days Present</td>
                    <td class="px-4 py-2 text-gray-700">9</td>
                  </tr>

                  <tr>
                    <td class="px-4 py-2 text-gray-700">Days Absent</td>
                    <td class="px-4 py-2 text-gray-700">1</td>
                  </tr>

                  <tr>
                    <td class="px-4 py-2 text-gray-700">
                      Total Days School Opened
                    </td>
                    <td class="px-4 py-2 text-gray-700">9</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex-1 mx-8 w-full">
              <table class="mt-8 w-full flex-col border-separate border-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 text-left flex-1 items-left py-2 font-bold bg-gray-100">
                      Extra Curricular Activities
                    </th>
                    <th class="px-4 flex-1 w-fit text-left  py-2 font-bold bg-gray-100">

                      Score
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td class="px-4 py-2 text-gray-700">Taekwondo</td>
                    <td class="px-4 py-2 text-gray-700">9</td>
                  </tr>

                  <tr>
                    <td class="px-4 py-2 text-gray-700">Football</td>
                    <td class="px-4 py-2 text-gray-700">1</td>
                  </tr>

                  <tr>
                    <td class="px-4 py-2 text-gray-700">
                    Chess
                    </td>
                    <td class="px-4 py-2 text-gray-700">9</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-gray-700">
                    Scrabble
                    </td>
                    <td class="px-4 py-2 text-gray-700">9</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 text-gray-700">
                    Handwriting
                    </td>
                    <td class="px-4 py-2 text-gray-700">9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <div className="text-md font-mono mt-8 border-[0.6px] rounded-lg  p-6 pt-2">

          <h1 className="font-bold p-2 pb-4"> Teacher's Comment</h1>
            <p>
            In the above code, we use the addDoc function to add a new document to a Firestore collection. After the document is successfully created, we can access its ID using docRef.id. This ID is then logged to the console and can be returned for further use in your application.
            </p>
          </div>


        <div className="flex">
        <div class="flex-1 flex-col items-end mt-28  justify-end mt-8">

<div className="border-2 w-80  border-black"></div>
  <span class="font-bold">Teachers's Signature</span>
</div>


<div class="flex-1 flex-col items-end flex mt-28  justify-end mt-8">

<div className="border-2 w-80  border-black"></div>
  <span class="font-bold">Parent's Signature</span>
</div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCardPage;

