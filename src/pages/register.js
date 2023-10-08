import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,useToast
} from '@chakra-ui/react';
import { registerUrl } from '../url';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate()
  const Toast = useToast()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
    // Handle registration logic here (e.g., API call)
    handleSubmits(formData,setFormData,navigate,Toast)
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
      <Box maxW="md" w="full" spacing={8}>
        <Box textAlign="center">
          <Text fontSize={"xl"}>Register</Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>
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
                autoComplete="new-password"
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
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

async function handleSubmits(formData,setFormData,navigate,Toast){
  
  try{
 

      let registerUser = await fetch(registerUrl,{
          method: "POST",
          headers:{"Content-Type": "application/json"},
          mode:"cors",
          credentials:'include',
          body: JSON.stringify({
              userName:formData.username,
              password:formData.password,
              email:formData.email,
          })
      })
      let registerUserJson =await registerUser.json()
      if(registerUser.status==400){
          if(registerUserJson.message.email){
              setFormData({...formData,email:""})
              Toast(  {
                title: 'Error ,Email already exists!',
                status: 'error',
                duration: 4000,
                isClosable: true,
              })
              return 
          }
      }
      if(registerUser.status==500){
          // show a toast
          Toast(  {
            title: 'Internal server err.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          return
      }
      if(registerUser.status===201){
          // show toast
          const user = registerUserJson.message[0]
          user.token = registerUserJson.message[1]
        localStorage.setItem("user",JSON.stringify(user))
          Toast(  {
            title: 'Successfully registered',
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
          navigate("/")
          window.location.reload()
          return
      }

  
}
catch(err){
  console.log(err)
  // toast
  return
}

}

export default RegisterForm;
