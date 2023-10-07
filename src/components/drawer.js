import React from 'react'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Text,
    Input
  } from '@chakra-ui/react'
const user = JSON.parse(localStorage.getItem('user'))

  function DrawerExample({selectedSavedPdf,setSelectedSavedPdf}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  
    return (
      <>
      {user?.email&&  <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
          History
        </Button>
       } <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>
  
            <DrawerBody>
             {
                user?.pdfs?.length > 0?
                user?.pdfs.map((pdf)=>{
                    return <Button w="full" onClick={()=>{
                        if(selectedSavedPdf==pdf._id)setSelectedSavedPdf("")
                       else setSelectedSavedPdf(pdf._id)}} overflowX={"clip"}  fontSize={"sm"} my={4} fontWeight={'semibold'} key={pdf._id}>{new Date(pdf.createdAt).toString()}</Button>;

                })
                :<Text>You've not yet created anything</Text>
             }
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }



  

  export default DrawerExample