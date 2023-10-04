import { loginUrl } from "../url"

export default async function handleLogin(formData,setFormData,navigate,Toast){
  const user = JSON.parse(localStorage.getItem("user"))
    try{
   
  
        let loginUser = await fetch(loginUrl,{
            method: "POST",
            headers:{"Content-Type": "application/json",},
            mode:"cors",
            credentials: 'include',
            body: JSON.stringify({            
                password:formData.password||user.password,
                email:formData.email||user.email,             
            })
        })
        let loginUserJson =await loginUser.json()
        if(loginUser.status==400){
            if(loginUserJson.message.email){
               
                return 
            }
            else{
              setFormData({...formData,password:""})
              
        }
        if(loginUser.status==500){
          // show a toast
          
            return
        }
        if(loginUser.status===200){
            // show toast
            
          localStorage.setItem("user",JSON.stringify(loginUserJson.message))
            navigate("/")
            return
        }
  
        }
  }
  catch(err){
    console.log(err)
    // toast
    return
  }
  
  }
  
  