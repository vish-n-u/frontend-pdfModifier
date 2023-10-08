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
import { useNavigate } from 'react-router-dom';

import downloadPDF from '../helperFunction/downLoad';
import loadPDFAndRenderOnScreen from '../helperFunction/uploadAndShow';
import DrawerExample from '../components/drawer';
import ShowLoginMessage from '../components/showLoginMsg';
import handleSelectedPages from '../helperFunction/handleSelectedPages';
import handleLogin from '../helperFunction/loginFunction';
import { getSinglePdf, savePdf } from '../url';
import { DownloadIcon } from '@chakra-ui/icons';



const PdfUploaderAndViewer = () => {
  let user = JSON.parse(localStorage.getItem('user'))
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState([])
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
      headers:{ 'Authorization': `Bearer ${user.token}`},
      mode:"cors",
      credentials:"include",
    })
    setSelectedFile("")
    setIsFromBackend(true) // set to true to ensure doesnt conflict with uploads
    setCurrentPage(1)
    const pdfArrayBuffer = await data.arrayBuffer()   
    console.log("pdfArrayBuffer---", pdfArrayBuffer) 
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
     
   await downloadPDF(selectedPages,Toast,uri)
}
  const handleFileChange = (e) => {
    // ensures previous settings dont mess with new uploads
    setCurrentPage(1)   
    setPdf(null)      
    setPdfPages([])   
    setSelectedPages([])  
    setTotalPages(0)

    const file = e.target.files[0];
    console.log("file: " + file,e.target)
    setSelectedFile(file);
    e.preventDefault()
  };

  
async function handleUpload(){
  setSelectedSavedPdf("")
  if(!selectedFile){ Toast({title:"Select a file...",duration:3000,isClosable:true,status:"error"})
return
}
if(selectedFile.size>5000000){
  Toast({title:"File Size too large",description:"Seems that the file size is larger than 5Mb , it wont be stored",duration:3000,isClosable:true,status:"warning"})
return
}
  const formData = new FormData();
  formData.append('pdfFile', selectedFile ); // 'pd
  if (formData.has('pdfFile')) 
  console.log(formData,"formData")
  try{
  
const savedPdf = await  fetch(savePdf, {
  headers:{ 'Authorization': `Bearer ${user.token}`},

    method: 'POST',
    credentials:"include",
    body: formData,
  })
  console.log(savedPdf,"savedPdf")
  const savedPdfData = await savedPdf.json()
  
  console.log(savedPdfData)
 
if(savedPdf.status==201){
  Toast({title:"Successfully saved PDf",status:"success",duration:"3000",isClosable:true})
  const token = user.token
  localStorage.removeItem("user")
  const newUser = savedPdfData.message
  newUser.token = token
  localStorage.setItem("user",JSON.stringify(newUser))
  user = savedPdfData.message
  return
}
else{
  Toast({title:"internal error while uploading",status:"error",duration:"3000",isClosable:true})

}

}
catch(err){
  console.log(err,"error uploading")
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
    <Center mt="40px"  h={{xl:"100vh",lg:"100vh",base:"auto"}} display="flex" flexDirection={{base:"column",lg:"row",xl:"row"}} alignItems="center" justifyContent="space-evenly">
      <Box h="10%"  position="absolute" left={0} top={0} justifyContent={"flex-start"}>
      <DrawerExample selectedSavedPdf={selectedSavedPdf} setSelectedSavedPdf={setSelectedSavedPdf}/>
      </Box>
      
      <Box w={{base:"100vw",lg:"30%",xl:"30%"}} maxW="600px" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
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
          colorScheme="blue"
          isDisabled={!selectedFile||!user?.email}
          onClick={()=>handleUpload()}
        >
          Upload
        </Button>
      </Box>

      {loading && <Text>Loading...</Text>}

      {pdfPages.length > 0 && !loading && (
        <Box display="flex" my={{base:"105px",lg:"0px",xl:"0px"}}  border={"1px"} borderColor={"gray.200"} h="70%" w={{base:"100vw",lg:"40%",xl:"40%"}}  alignItems="center" justifyContent={"center"} flexDirection="column">
        <Text fontSize="xl" mb="4">Select The pages you want to download</Text>
      <Box w="full" justifyContent={"space-between"} alignItems={"center"} h="80%" display={"flex"} flexDirection={{base:"column",lg:"row",xl:"row"}}>
        
            <Button mx="4" my="8" onClick={() => goToPage(currentPage - 1)}>Previous</Button>
            <Box display={"flex"} justifyContent={"center"}  alignItems={"center"} flexDirection={"column"}>
            <Box  w={{base:"80%" , lg:"350px",xl:"350px"}} maxW={"350px"} justifyContent={"center"} alignItems={"center"} display={"flex"} position="relative">
          <Image w={{base:"90%" , lg:"300px",xl:"300px"}} maxW={"350px"}   h="80%" bgColor="red"
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
          top="4%" // Use a string with the unit (e.g., "10px")
          right={{xl:"12%",lg:"12%",base:"2%"}}
          bgColor={"white"}
          colorScheme='green'
          size={'lg'}
          isChecked={isPageSelected(currentPage, selectedPages)}
          onChange={(e) => {
            // Create a new array with the updated value
            handleSelectedPages(e.target.checked,selectedPages,currentPage,setSelectedPages)
           
                }}
>
</Checkbox>
</Box>
<Box mt="5" display="flex" w="full" alignItems="center" justifyContent={"center"}>
            <label htmlFor="pageNumber" style={{fontSize:"18px",fontWeight:"bold",marginRight:"15px"}}>{"Page number:    "}</label>      <select my="8" mx="5"  style={{fontSize:"18px",fontWeight:"bold",border:"1px solid black",borderColor:"black",padding:"6px"}} onChange={(e)=>setCurrentPage(Number(e.target.value))} value={currentPage} id="pageNumber">
 {
  pdfPages.map((page,i)=><option key={i}  value={i+1}>{i+1}</option>)
 }
</select>  
</Box>
            
           
       
        
          
</Box>
<Button mx="4" my="5" paddingX={"8"} onClick={() => goToPage(currentPage + 1)}>Next</Button>
        </Box>
        </Box>
      )}
      <Button display={selectedPages.length?"flex":"none"} maxW={"170px"} bgColor={"blue.400"} w={"50%"} h="50px" onClick={handleDownload}><DownloadIcon borderRadius={"full"} border={1} boxSize={6}></DownloadIcon>Download</Button>
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

function isPageSelected(currentPage,selectedPages){
  if(!selectedPages) return false
  for(let x =0;x<selectedPages.length;x++){
    if(selectedPages[x]==currentPage)return true
  }
  return false
}


export default PdfUploaderAndViewer;




