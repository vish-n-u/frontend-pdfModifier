import {GlobalWorkerOptions,getDocument,version} from 'pdfjs-dist';
const PDFJS = window.pdfjsLib;
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

async function loadPDFAndRenderOnScreen (selectedFile,setUri,setPdf,setTotalPages,setPdfPages,setLoading,showLogin,) {
    try {
      let user = JSON.parse(localStorage.getItem("user"))
      if (selectedFile) {
        setLoading(true); // Show loading message
       if(!user&&showLogin) {document.getElementById("userExist").click()
      }
       // Create a FormData object and append the PDF file to it
       console.log("selectedFile",selectedFile)
        const uri = await URL.createObjectURL(selectedFile)
        console.log("uri",uri)
        setUri(uri)
        const pdfData = await PDFJS.getDocument({url:uri});
        const pdfDoc = await pdfData.promise.then((pdf) => pdf);
        console.log("pdfData: " + pdfData,pdfDoc,"pdfDoc")
          setPdf(pdfDoc);
        // Get the total number of pages in the PDF
        setTotalPages(pdfDoc.numPages);
  
        // Load individual pages and store them in the `pdfPages` state
        const loadedPages = [];
        for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
          const page = await pdfDoc.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 3.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          console.log("page",page,canvas)
          loadedPages.push(canvas.toDataURL('image/png'));
        }
        setPdfPages(loadedPages);
        console.log('loaded pages',loadedPages)
        setLoading(false); // Hide loading message
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      setLoading(false); // Hide loading message in case of error
    }
  };
  
  

  




  export default loadPDFAndRenderOnScreen  

