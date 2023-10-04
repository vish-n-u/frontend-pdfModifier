import { loginUrl } from "../url"

export default async function handleLogin(formData,setFormData,navigate,Toast){
  const user = JSON.parse(localStorage.getItem("user"))
    try{
   
  console.log("reached here")
        let loginUser = await fetch(loginUrl,{
            method: "POST",
            headers:{"Content-Type": "application/json",},
            mode:"cors",
            credentials: 'include',
            body: JSON.stringify({            
                password:user.password,
                email:user.email,             
            })
        })
        let loginUserJson =await loginUser.json()
        if(loginUser.status==400){
            if(loginUserJson.message.email){
               
                return 
            }
            else{
            //   setFormData({...formData,password:""})
            console.log("")
              
        }
        if(loginUser.status==500){
          // show a toast
          
            return
        }
        if(loginUser.status===200){
            // show toast
            localStorage.removeItem("user")
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
  
  