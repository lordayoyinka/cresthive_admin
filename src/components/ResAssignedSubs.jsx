import React from 'react'



const people = [
  {
    name: "Assingment",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecoop9er@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/folders.png",
  },
  {
    name: "Assingment",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecoopuer@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/folders.png",
  },
  {
    name: "Assingment",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecoopeir@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/folders.png",
  },
  {
    name: "CHM102",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper2@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/folders.png",
  },
  {
    name: "mathematics JSS2",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/folders.png",
  },
  {
    name: "mathematics JSS2",
    title: "Paradigm Representative",
    email: "janecoopesr1@example.com",
   
    imageUrl: "/Assets/folders.png",
  },
  // More people...
];

const ResAssignedSubs = () => {
  return (
    <div> 
    <div className=" ">
    <h2 className="font-semibold font-32 opacity-50">Assigned Subjects</h2>
    <p className="text-xs opacity-60 mb-5">This are the subjects you are incharge of</p>

    <ul
      role="list"
      className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
    >
      {people.map((person) => (
        <a href='./ResPart'><li
          key={person.email}
          className="w-full  m-2 justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow "
        >
          <div className="flex-1 flex flex-col p-2 ">

          <div className='flex justify-between'>
          <img
              className="w-12 h-12 flex-shrink-0 "
              src={person.imageUrl}
              alt=""
            />

          
          </div>
          
            <h3 className="mt-6 text-gray-900 text-xs font-medium">
              {person.name}
            </h3>
          
          </div>
          <div></div>
        </li>
        </a>
      ))}
    </ul>
  </div>
  
  </div>
  )
}

export default ResAssignedSubs