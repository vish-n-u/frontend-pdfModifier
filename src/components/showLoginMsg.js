import React from "react"
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react"

function ShowLoginMessage({navigate}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
  
    return (
      <>
        <Button display={"none"} id="userExist" onClick={onOpen}>D</Button>
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
              <Button colorScheme='blue' onClick={()=>navigate("/login")} ml={3}>
                Login
              </Button>
              <Button colorScheme='green' onClick={()=>navigate("/register")} ml={3}>
                Register
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  export default ShowLoginMessage