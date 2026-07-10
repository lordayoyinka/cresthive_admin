/* This example requires Tailwind CSS v2.0+ */
import {
  HomeIcon,
  UsersIcon,
  InboxIcon,
  ChartBarIcon,
  KeyIcon,
  MailIcon,
  BriefcaseIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";

import { BellIcon } from "@heroicons/react/outline";
import { Menu } from "@headlessui/react";
import { useState, useEffect } from "react";
import { StorageErrorCode } from "firebase/storage";
import { auth2 } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";




const Sidebar = ({ children }) => {

  const router = useRouter();

  const [toggleon, setToggleOn] = useState(false);
  const [navigationadmin, setNavigation] = useState([
    { name: "Dashboard", icon: HomeIcon, href: "/Maindash", current: true },
    {
      name: "Classes",
      icon: UsersIcon,
      href: "./AdminClassesPage",
      current: false,
    },
    {
      name: "Manage Teachers",
      icon: InboxIcon,
      href: "./AllTeachersPage",
      current: false,
    },
    {
      name: "Manage Students",
      icon: ChartBarIcon,
      href: "./AllStudentsPage",
      current: false,
    },
    { name: "Messages", icon: MailIcon, href: "./AllMessages", current: false },

    { name: "Tokens", icon: KeyIcon, href: "./TokensPage", current: false },
    { name: "CMS", icon: BriefcaseIcon, href: "./CmsPage", current: false },
    { name: "Admissions", icon: DocumentTextIcon, href: "./AdmissionsIndex", current: false },

  ]);

  const iconMapping = {
    Dashboard: HomeIcon,
    Classes: UsersIcon,
    "Manage Teachers": InboxIcon,
    "Manage Students": ChartBarIcon,
    Messages: MailIcon,
    Tokens: KeyIcon,
    CMS: BriefcaseIcon,
    Admissions: DocumentTextIcon,
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    // Load navigation from localStorage when the component mounts
    const storedNavigationadmin =
      JSON.parse(localStorage.getItem("navigationadmin")) || navigationadmin;
    setNavigation(storedNavigationadmin);
    console.log(storedNavigationadmin);
  }, []);

  useEffect(() => {
    console.log(navigationadmin);
  }, [navigationadmin]);

  const toggleCurrentStatus = (name) => {
    const updatedNavigation = navigationadmin.map((item) => ({
      ...item,
      current: item.name === name,
    }));
    setNavigation(updatedNavigation);

    // Save the updated navigation to localStorage
    localStorage.setItem("navigationadmin", JSON.stringify(updatedNavigation));
  };




  const [user, setUser] = useState();
  const [profilepic, setprofilepic] = useState("");

  if (user) {
    const userid = user.uid;
  }

  useEffect(() => {
    // Use Firebase's onAuthStateChanged to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth2, (authUser) => {
      if (authUser) {
        // User is authenticated, set the user state
        setUser(authUser);
        setprofiledp(authUser.uid);

      } else {
        // User is not authenticated, set the user state to null
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  const handleGoBack = () =>{
    router.back();
  }


  const setprofiledp = async (uid) => {
    const db = getFirestore();



    const docref = doc(db, "Admins", uid);
    const snapshot = await getDoc(docref);


    const data = snapshot.data();
    console.log(snapshot, "uid")

    if (data && data.profilePicture) {
      setprofilepic(data.profilePicture);
      console.log("dp", data.profilePicture)

    }





  }



  // Log out of Firebase
  const handleLogout = async () => {
    console.log("s o")

    const auth = getAuth();
    console.log("signing out")

    await signOut(auth);

    console.log("signed out")
    // Remove user data from the browser
    localStorage.removeItem("navigationadmin");

    // Redirect or perform any additional actions as needed

    router.push("/")
  };


  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");

  if (!year || !term) {

    signOut(auth2);
  }



  return (
    <div className="fixed flex w-full h-screen">
      <div className="absolute m-5 lg:hidden md:hidden">
        <p onClick={() => setToggleOn(true)}>Menu</p>
      </div>

      <div className={toggleon === false ? "hidden" : ""}>
        <div className="absolute z-50 bg-[#39623D] w-5/6 h-screen flex-col border-r border-gray-200 pt-2 pb-4 ">
          <div className="flex justify-end px-4 text-2xl text-white w-full">
            <div onClick={() => setToggleOn(false)} className="justify-end">
              {" "}
              x{" "}
            </div>
          </div>

          <div className="mx-auto flex align-items-center m-2 w-fit ">
            <a href="www.crestscholars.com">
              <img
                className="w-10 p-1 mx-auto h-10 rounded-full bg-white"
                src="./Assets/logo.png"
              />
            </a>
            <p className="align-self-center pb-5 text-lg font-semibold text-white mx-6 mt-3 ">
              {" "}
              Crest<span className="text-amber-500">hive</span>
            </p>
          </div>

          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2  space-y-1" aria-label="Sidebar">
              {navigationadmin.map((item) => {
                const IconComponent = iconMapping[item.name];

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => toggleCurrentStatus(item.name)}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-white hover:bg-gray-50 hover:text-gray-600",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md "
                    )}
                  >
                    {IconComponent && (
                      <IconComponent
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${item.current
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        aria-hidden="true"
                      />
                    )}

                    <span className="flex-1 /flex">{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="h-60 w-full flex items-end">

            <div onClick={() => handleLogout()} className="bg-orange-500 text-white w-full font-semibold justify-center text-center rounded-xl h-fit py-3 m-4 mb-8 ">
              <p >Log out</p>
            </div>

          </div>
        </div>


      </div>

      <div className="hidden md:flex md:flex bg-[#39623D] w-1/6 flex-col border-r border-gray-200 pt-5 pb-4 ">
        <div className="m-2 ">
          <a href="www.crestscholars.com">
            <img
              className="w-10 mx-auto p-1 h-10 rounded-full bg-white"
              src="./Assets/logo.png"
            />
          </a>

          <p className="pb-5 text-lg font-bold text-white w-fit mx-auto mt-4 ">
            Crest<span className="text-orange-200">Hive</span>
          </p>
        </div>

        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2  space-y-1" aria-label="Sidebar">
            {navigationadmin.map((item) => {
              const IconComponent = iconMapping[item.name];

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => toggleCurrentStatus(item.name)}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-white hover:bg-gray-50 hover:text-gray-600",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md "
                  )}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${item.current
                          ? "text-gray-500"
                          : "text-white group-hover:text-gray-500"
                        }`}
                      aria-hidden="true"
                    />
                  )}

                  <span className="flex-1 /flex">{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>


        <div className="h-80 w-full flex items-end">

          <div onClick={() => handleLogout()} className="bg-orange-500 text-white w-full font-semibold justify-center text-center rounded-xl h-fit py-3 m-4 mb-8 ">
            <p >Log out</p>
          </div>

        </div>
      </div>

      {/* Content area */}

      <div className="flex-grow-col w-full h-full overscroll-y-auto overflow-x-none">
        <div className="flex p-4 items-center justify-end md:justify-between  flex-grow bg-white ">
        <div className="hidden md:flex">
            <p onClick={handleGoBack} className="rounded-2xl px-4 py-2 text-white bg-green-700"> 
              ← Go back
            </p>
          </div>


         <div className="flex space-x-4">
  
         <button
            type="button"
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">View notifications</span>
            <a href="./Notifications">
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={profilepic}
                  alt=""
                />
              </Menu.Button>
            </div>
          </Menu>
         </div>
       
        </div>

        <div className="overflow-y-auto h-screen ">
        {children}

        </div>

      </div>
    </div>
  );
};

export default Sidebar;
