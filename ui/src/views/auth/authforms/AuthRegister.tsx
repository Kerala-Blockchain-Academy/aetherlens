import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert } from 'flowbite-react';

const AuthRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    UserName: '',
    Password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
    console.log('Form submitted:', formData);
    const data = formData;
    const result = await fetch('http://127.0.0.1:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(result.status);

    const res = await result.json();
    console.log(res);

    if (result.status == 200) {
      navigate('/dash');

      //  const element = document.getElementById("noti")
      //  element?.textContent="Sucessfully Registered.. Pls Proceed to Login"
    } else {
      return (
        <Alert color="primary" className="rounded-md">
          <span className="font-medium">Primary</span> - A simple primary alert
        </Alert>
      );
    }

    //  navigate("/");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput
            id="Name"
            type="text"
            onChange={handleChange}
            sizing="md"
            required
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="emadd" value="UserName" />
          </div>
          <TextInput id="UserName" sizing="md" required className="form-control form-rounded-xl" />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="Password"
            type="password"
            sizing="md"
            required
            className="form-control form-rounded-xl"
          />
        </div>
        <Button color={'primary'} type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
      <div id="noti"></div>
    </>
  );
};

export default AuthRegister;
