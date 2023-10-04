import React, { useState, useEffect } from 'react';
import {
  Box,
  Center,
  Flex,
  Text,
  Input,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FaFilePdf } from 'react-icons/fa';
import {GlobalWorkerOptions,getDocument,version} from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import downloadPDF from './helperFunction/downLoad';
import loadPDF from './helperFunction/uploadAndShow';
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Checkbox, CheckboxGroup,Image,useToast } from '@chakra-ui/react'

let user = JSON.parse(localStorage.getItem("user"))
// import { Checkbox } from '@chakra-ui/react/dist';
const PDFJS = window.pdfjsLib;
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

const PdfUploaderAndViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState([])
  const [uri,setUri] = useState('');
  const Toast = useToast()
  const [showLogin,setShowLogin] = useState(true)

  useEffect(()=>{ async function fetchData(){
    const data = await fetch("http://localhost:5000/getFile",{
      mode:"cors",
      responseType: 'arraybuffer',
    })
    const pdfArrayBuffer = await data.arrayBuffer()    
    console.log(data,pdfArrayBuffer)
    const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

// Create a URL for the Blob
await  loadPDF(pdfBlob,setUri,setPdf,setTotalPages,setPdfPages,setLoading,showLogin,setShowLogin)
  }  
  fetchData()
  },[])
  

  useEffect(() => {
    const load = async () => {
      try {
        if (selectedFile) {
          setLoading(true); // Show loading message
          console.log("selected file",selectedFile)
          
          
         // Create a FormData object and append the PDF file to it
          const formData = new FormData();
          formData.append('pdfFile', selectedFile ); // 'pd
          if (formData.has('pdfFile')) {
            console.log('pdfFile is present in formData');
          }
        await  fetch('http://localhost:5000/uploadPDF', {
            method: 'POST',
            body: formData,
          })
        await  loadPDF(selectedFile,setUri,setPdf,setTotalPages,setPdfPages,setLoading,showLogin,setShowLogin)
      }
     } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false); // Hide loading message in case of error
      }
    

   
    
  }
  load()
}, [selectedFile]);

  const handleDownload =async()=>{

   await downloadPDF(selectedPage,Toast,uri)

}

  

  const handleFileChange = (e) => {
    setCurrentPage(1)
    setPdf(null)
    setPdfPages([])
    setSelectedPage([])
    setTotalPages(0)
    
    const file = e.target.files[0];
    console.log("file",file)
    setSelectedFile(file);
    e.preventDefault()
  };

  

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  console.log("totalPages: " + totalPages)

  return (
    <Center mt="40px"  h="100vh" display="flex" flexDirection="row" alignItems="center" justifyContent="space-around">
      <Box w="30%"  p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        <Center>
          <IconButton
            icon={<FaFilePdf />}
            fontSize="2xl"
            variant="outline"
            isRound
          />
        </Center>
        <Text mt={4} fontWeight="bold">
          Upload and View a PDF File
        </Text>
        <Flex  align="center" mt={4}>
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            display="none"
            id="pdf-file"
          />
          <label htmlFor="pdf-file">
            <Button as="span" leftIcon={<FaFilePdf />}>
              Choose File
            </Button>
          </label>
          {selectedFile && (
            <Text ml={2} color="green.500">
              {selectedFile.name}
            </Text>
          )}
        </Flex>
        <Button
          mt={4}
          colorScheme="teal"
          isDisabled={!selectedFile}
        >
          Upload
        </Button>
      </Box>

      {loading && <Text>Loading...</Text>}

      {pdfPages.length > 0 && !loading && (
        <Box display="flex" w="50%" alignItems="center" flexDirection="column">
        <Text fontSize="xl" mb="4">Select The pages you want</Text>
        <Box  h="50%" w="40%" display="flex" flexDirection="column-reverse" alignItems="center" justifyContent={"center"}   > 
          <Box mt="5" display="flex" w="full" alignItems="center" justifyContent={"center"}>
            <Button mx="4" onClick={() => goToPage(currentPage - 1)}>Previous</Button>
            Page {currentPage} of {totalPages}
            <Button mx="4" onClick={() => goToPage(currentPage + 1)}>Next</Button>
          </Box>
          <Box maxW="350px" position="relative">
          <Image maxW="300px"  h="80%" bgColor="red"
            src={pdfPages[currentPage - 1]}
            alt={`Page ${currentPage}`}
            width="500"
            border="1px"
             height="100%"
          />
           <Checkbox
          position="absolute"
          border="1px"
          borderColor="black"
          top="4px" // Use a string with the unit (e.g., "10px")
          right="3%"
          colorScheme='green'
          isChecked={isPageSelected(currentPage, selectedPage)}
          onChange={(e) => {
            // Create a new array with the updated value
            const isChecked = e.target.checked
            console.log("isClicked",isChecked,selectedPage)
            let updatedSelectedPages
            if(isChecked)  updatedSelectedPages = [...selectedPage, currentPage];
            else{
              console.log("index",selectedPage,currentPage)
              let index = selectedPage.indexOf(currentPage)
              console.log("index")
              updatedSelectedPages = [...selectedPage]
              updatedSelectedPages.splice(index, 1)
              console.log(updatedSelectedPages,"selectedUpdatedPages")
              console.log("isClicked",isChecked,selectedPage,currentPage,updatedSelectedPages)

            }
            console.log("updatedSelectedPages",updatedSelectedPages)
            updatedSelectedPages = !updatedSelectedPages?.length?[]:updatedSelectedPages
    
    console.log(updatedSelectedPages);
    setSelectedPage(updatedSelectedPages); // Update the state
  }}
>
</Checkbox>
</Box>
        </Box>
        </Box>
      )}
      <Button display={selectedPage.length?"flex":"none"} onClick={handleDownload}>Download</Button>
  <TransitionExample />
    
    </Center>
  );
};

function isPageSelected(currentPage,selectedPage){
  console.log("selected page",selectedPage)
  if(!selectedPage) return false
  for(let x =0;x<selectedPage.length;x++){
    if(selectedPage[x]==currentPage)return true
  }
  return false
}

function TransitionExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  return (
    <>
      <Button display={"none"} id="userExist" onClick={onOpen}>Discard</Button>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Do you want to signIn</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
           To save your pdf files you need to be logged in
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef}  onClick={()=>{
               onClose()}}>
              No
            </Button>
            <Button colorScheme='blue' ml={3}>
              Login
            </Button>
            <Button colorScheme='green' ml={3}>
              Register
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
export default PdfUploaderAndViewer;




