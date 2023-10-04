useEffect(() => {
    const loadPdf = async () => {
      try {
        if (selectedFile) {
          let file = selectedFile;
          setLoading(true); // Show loading message
            // Initialize PDF.js
            
  
            // Get the total number of pages in the PDF
            setTotalPages(pdfDoc.numPages);
  
        
            // Read the contents of the file into an ArrayBuffer
           
            console.log(pdfDoc)
  
            // Rest of your code remains the same
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
              loadedPages.push(canvas.toDataURL('image/png'));
            }
          
  
          // Read the file as an ArrayBuffer
        //   reader.readAsArrayBuffer(file);
        }
      } catch (e) {
        console.log(e);
      }
    };
  
    loadPdf();
  }, [selectedFile]);