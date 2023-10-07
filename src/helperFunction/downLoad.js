import { PDFDocument } from 'pdf-lib';
let user = JSON.parse(localStorage.getItem("user"))


async function downloadPDF(selectedPage,Toast,uri){
  console.log("called Download`")
    try {
      if(!selectedPage.length) {Toast(  {
        title: 'Please Select a page.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    return
    }
      selectedPage.sort((a,b)=>a-b)
      
      // Load the original PDF document
      const originalPdfBytes = await fetch(uri).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(originalPdfBytes);
      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();
    
      // Select the pages to include from the existing PDF
       // Example: Include pages 1, 3, and 5
    
      for (const pageNumber of selectedPage) {
        // Copy the selected page from the existing PDF to the new PDF
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
    
        // Add the copied page to the new PDF
        newPdfDoc.addPage(copiedPage);
      }
    
      // Serialize the new PDF to a buffer
      const newPdfBuffer = await newPdfDoc.save();
    
      // Write the new PDF buffer to a new file or perform further actions
      // fs.writeFileSync('path-to-new-pdf.pdf', newPdfBuffer);
      const blob = new Blob([newPdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
    
      const a = document.createElement('a');
      a.href = url;
      a.download = 'new_pdf.pdf'; // Specify the desired filename
      a.click();
    
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export default downloadPDF