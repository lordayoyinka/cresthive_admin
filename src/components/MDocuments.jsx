import React from 'react'


const people = [
  {
    name: "Assingment",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper@example.com",
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
    role: "Admin",
    email: "janecoopesr1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/folders.png",
  },
  // More people...
];

const MDocuments = () => {
  return (
    <div className='flex-col bg-white my-2 p-4 rounded-lg'>
     <div className=" ">
        <h2 className="font-semibold font-32 opacity-50">Students Overview</h2>
        <p className="text-xs opacity-60 mb-5">This will show details of overall students performance</p>

        <ul
          role="list"
          className="gap-2 grid-cols-1 md:flex lg:flex"
        >
          {people.map((person) => (
            <li
              key={person.email}
              className="flex-1 mb-2 justify-self-center p-2 align-self-start col-span-1 flex flex-col text-start bg-gray-50 rounded-lg shadow "
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
          ))}
        </ul>
     
      </div>
    </div>
  )
}

export default MDocuments