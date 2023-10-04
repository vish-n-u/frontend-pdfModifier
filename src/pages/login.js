import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { loginUrl } from '../url';
import { useNavigate } from 'react-router-dom';


function Login() {
  const Toast = useToast()
  const Navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData,setFormData,Navigate,Toast)
    // Handle login logic here (e.g., API call)
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={12}
      px={4}
      sm={6}
      lg={8}
    >
      <Box maxW="md" h="full" w="full" spacing={8}>
        <Box textAlign="center">
          <Text fontSize={"xl"}>Log In</Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              width="full"
            >
              Log In
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
async function handleLogin(formData,setFormData,navigate,Toast){
  
  try{
 

      let loginUser = await fetch(loginUrl,{
          method: "POST",
          headers:{"Content-Type": "application/json",},
          mode:"cors",
          credentials: 'include',
          body: JSON.stringify({            
              password:formData.password,
              email:formData.email,             
          })
      })
      let loginUserJson =await loginUser.json()
      if(loginUser.status==400){
          if(loginUserJson.message.email){
              setFormData({...formData,email:""})
              Toast(  {
                title: 'Error ,Incorrext Email!',
                status: 'error',
                duration: 4000,
                isClosable: true,
              })
              return 
          }
          else{
            setFormData({...formData,password:""})
            Toast(  {
              title: 'Error ,! Incorrect password',
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
          }
      }
      if(loginUser.status==500){
        // show a toast
        Toast(  {
          title: 'Error ,Internal server err!',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
          return
      }
      if(loginUser.status===200){
          // show toast
          Toast(  {
            title: 'Successfully logged in!',
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
        localStorage.setItem("user",JSON.stringify(loginUserJson.message))
          navigate("/")
          return
      }

  
}
catch(err){
  console.log(err)
  // toast
  return
}

}



export default Login;

