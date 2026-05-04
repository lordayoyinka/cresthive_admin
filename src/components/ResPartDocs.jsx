import React from 'react'


const documents = [
  {
    name: "Assingment",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/google-docs.png",
  },
  {
    name: "mathematics JSS2",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecooper1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/pdf-file.png",
  },
  {
    name: "mathematics JSS2",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecoopesr1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/pdf-file.png",
  },
  {
    name: "CHM102",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecooper2@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/google-docs.png",
  },
  {
    name: "mathematics JSS2",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecooper1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/pdf-file.png",
  },
  {
    name: "mathematics JSS2",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecooper1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/pdf-file.png",
  },
  {
    name: "mathematics JSS2",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecoopesr1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/pdf-file.png",
  },
  {
    name: "mathematics JSS2",
    date: "Created : 12-Jan-2023",
    role: "Admin",
    email: "janecoopesr1@example.com",
    telephone: "+1-202-555-0170",
    imageUrl: "/Assets/pdf-file.png",
  },
  // More documents...
];


const ResPartDocs = () => {
  return (
    <div>
     <div className="mb-5 bg-white p-6 rounded-lg ">
        <h2 className="font-semibold text-lg pb-4 opacity-50">Documents</h2>

        <ul
          role="list"
          className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
        >
          {documents.map((documentitem) => (
            <li
              key={documentitem.email}
              className="w-full  m-2 justify-self-start p-2 align-self-start flex-1 text-start bg-gray-50 rounded-lg shadow  "
            >
              <div className="flex-1 flex flex-col p-2 ">

              <div className='flex justify-between'>
              <img
                  className="w-12 h-12 flex-shrink-0 "
                  src={documentitem.imageUrl}
                  alt=""
                />

              
              </div>
              
              <div className='flex-col'>
                <h3 className="mt-6 text-gray-900 font-medium">
                  {documentitem.name}
                </h3>
                <h3 className=" text-red-900 place-content-bottom  text-xs font-medium">
                  {documentitem.date}
                </h3>

                </div>
              </div>
              <div></div>
            </li>
          ))}
        </ul>

        <h2 className="font-semibold flex justify-end text-blue-900 text-xs pt-4 opacity-90"><a href='/ResDocs'>See more</a></h2>

      </div>

    </div>
  )
}

export default ResPartDocs