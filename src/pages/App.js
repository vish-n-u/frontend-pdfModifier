import React, { useState, useEffect } from 'react';
import {
  Box,
  Center,
  Flex,
  Text,
  Input,
  IconButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import {  Button, Checkbox, Image,useToast } from '@chakra-ui/react'
import { FaFilePdf } from 'react-icons/fa';
import {GlobalWorkerOptions,version} from 'pdfjs-dist';
import { useNavigate } from 'react-router-dom';

import downloadPDF from '../helperFunction/downLoad';
import loadPDFAndRenderOnScreen from '../helperFunction/uploadAndShow';
import DrawerExample from '../components/drawer';
import ShowLoginMessage from '../components/showLoginMsg';
import handleSelectedPages from '../helperFunction/handleSelectedPages';
import handleLogin from '../helperFunction/loginFunction';
import { getSinglePdf, savePdf } from '../url';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`;

const user = JSON.parse(localStorage.getItem('user'))


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
  const [selectedSavedPdf,setSelectedSavedPdf] = useState('')
  const [isFromBackend,setIsFromBackend] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{ async function getUsersSinglePdf(){
    
    if(!selectedSavedPdf)return 
    setLoading(true)
    const data = await fetch(getSinglePdf+selectedSavedPdf,{ 
      mode:"cors",
      credentials:"include",
    })
    setSelectedFile("")
    setIsFromBackend(true) // set to true to ensure doesnt conflict with uploads
    const pdfArrayBuffer = await data.arrayBuffer()    
    const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
      await  loadPDFAndRenderOnScreen(pdfBlob,setUri,setPdf,setTotalPages,setPdfPages,setLoading,showLogin,setShowLogin)

  }
  getUsersSinglePdf()
  },[selectedSavedPdf])
  

  useEffect(() => {
    const load = async () => {
      try {
        if (selectedFile) {
          setLoading(true); 
          setIsFromBackend(false)// Show loading message
        await  loadPDFAndRenderOnScreen(selectedFile,setUri,setPdf,setTotalPages,setPdfPages,setLoading,showLogin,setShowLogin)
      }
     } catch (error) {
        setLoading(false); // Hide loading message in case of error
      }   
  }
  load()
}, [selectedFile]);

  const handleDownload =async()=>{
     
   await downloadPDF(selectedPage,Toast,uri)
}
  const handleFileChange = (e) => {
    // ensures previous settings dont mess with new uploads
    setCurrentPage(1)   
    setPdf(null)      
    setPdfPages([])   
    setSelectedPage([])  
    setTotalPages(0)

    const file = e.target.files[0];
    setSelectedFile(file);
    e.preventDefault()
  };

  
async function handleUpload(){
  setSelectedSavedPdf("")
  if(!selectedFile){ Toast({title:"Select a file...",duration:3000,isClosable:true,status:"error"})
return
}

  const formData = new FormData();
  formData.append('pdfFile', selectedFile ); // 'pd
  if (formData.has('pdfFile')) 
  try{
  
const savePdf = await  fetch(savePdf, {
    method: 'POST',
    credentials:"include",
    body: formData,
  })
if(savePdf.status==201){
  Toast({title:"Successfully saved PDf",status:"success",duration:"3000",isClosable:true})
  handleLogin("","",navigate,Toast)
  return
}
else{
  Toast({title:"internal error while uploading",status:"error",duration:"3000",isClosable:true})

}

}
catch(err){
  Toast({title:"internal error while uploading",status:"error",duration:"3000",isClosable:true})
  return
}
}

// changes selected page
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Center mt="40px"  h="100vh" display="flex" flexDirection="row" alignItems="center" justifyContent="space-around">
      <Box h="10%"  position="absolute" left={0} top={0} justifyContent={"flex-start"}>
      <DrawerExample selectedSavedPdf={selectedSavedPdf} setSelectedSavedPdf={setSelectedSavedPdf}/>
      </Box>
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
          isDisabled={!selectedFile||!user.email}
          onClick={()=>handleUpload()}
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
            handleSelectedPages(e.target.checked,selectedPage,currentPage,setSelectedPage)
           
                }}
>
</Checkbox>
</Box>
        </Box>
        </Box>
      )}
      <Button display={selectedPage.length?"flex":"none"} onClick={handleDownload}>Download</Button>
  <ShowLoginMessage navigate={navigate}/>
  {loading&&<Spinner
  position={"absolute"}
  top="30%"
  left="40%"
  thickness='4px'
  speed='0.65s'
  emptyColor='gray.200'
  color='blue.500'
  size='xl'
/> }
    </Center>
  );
};

function isPageSelected(currentPage,selectedPage){
  if(!selectedPage) return false
  for(let x =0;x<selectedPage.length;x++){
    if(selectedPage[x]==currentPage)return true
  }
  return false
}


export default PdfUploaderAndViewer;




