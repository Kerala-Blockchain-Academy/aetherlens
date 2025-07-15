import { Button, Label, TextInput } from 'flowbite-react';
import {  useNavigate } from 'react-router';
import { useState } from 'react';

const AuthLogin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   console.log(event.currentTarget);
    const form = event.currentTarget;
    const Form = new FormData(form);
    console.log(Form);
    
    const user = Form.get('Username');
    const pswd = Form.get('userpwd');
    console.log(user,pswd);
    
    // const userName = event.target.Username
    const data = {
      UserName:user,
      Password:pswd
    }
    const result = await fetch('http://127.0.0.1:8080/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(data)
    });
    console.log(result);
    

    if(result.status!=200){

      setIsVisible(true)
      // alert('Wrong username or password')

    }
    else{
      await fetch("http://127.0.0.1:8080/allContracts",{credentials:'include'})
    }
    // else{
    //   // navigate("/dash");
    //   // window.location.href ='/dash'
    // }
    if(result.ok)
    {
      console.log("Go to dashboard");
      
      navigate("/dash")
    }
    
  };
  return (
    <>
       <form onSubmit={handleSubmit} >
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="Username" value="Username" />
          </div>
          <TextInput
            id="Username"
            name="Username"
            type="text"
            sizing="md"
            required
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="userpwd"
            name="userpwd"
            type="password"
            sizing="md"
            required
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="flex justify-between my-5">
          {/* <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remeber this Device
            </Label>
          </div> */}
          {/* <Link to={"/"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link> */}
        </div>
        <div id='msg' style={{ display: isVisible ? 'block' : 'none' }} className="text-red-600">
            <p>Incorrect username or password</p>
        </div>
        <Button type="submit" color={"primary"}  className="w-full bg-primary text-white rounded-xl">
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
