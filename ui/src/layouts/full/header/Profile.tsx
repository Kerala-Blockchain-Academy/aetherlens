
import { Button, Dropdown } from "flowbite-react";
import user1 from "/src/assets/images/profile/user-1.jpg";
import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  async function handleLogout(){
    try{
      const res=await fetch('http://127.0.0.1:8080/logout',{
        method:'POST',
        credentials:'include'
      })
      console.log(res);
      
      if(res.status==200){
        console.log("Successfully loggedout");
        
        navigate('/')
      }
    }
    catch (error){
      console.log("Logout failed",error);
      
    }
    
  }
  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img
              src={user1}
              alt="logo"
              height="35"
              width="35"
              className="rounded-full"
            />
          </span>
        )}
      >

        {/* <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:user-circle-outline" height={20} />
          My Profile
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:letter-linear" height={20} />
          My Account
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:checklist-linear" height={20} />
          My Task
        </Dropdown.Item> */}
        <div className="p-3 pt-0">
        <Button onClick={handleLogout} size={'sm'}   className="mt-2 border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none">Logout</Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;

