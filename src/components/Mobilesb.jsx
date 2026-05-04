import React from 'react'

const mobilesb = () => {
  return (
    <div>  <div className="hidden lg:flex md:flex bg-[#39623D] w-1/6 flex-col border-r border-gray-200 pt-5 pb-4 ">
    <div className=" align-content-center m-2 ">

<img className="w-10 p-1 place-self-center h-10 rounded-full bg-white" src="./Assets/logo.png"/> 
<p className="align-self-center pb-5 text-lg font-semibold text-white mx-6 mt-4 "> Cresthive</p>



</div>

      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2  space-y-1" aria-label="Sidebar">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-100 text-gray-900"
                  : "text-white hover:bg-gray-50 hover:text-gray-600",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md "
              )}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 flex-shrink-0 h-6 w-6 "
                )}
                aria-hidden="true"
              />
              <span className="flex-1 hidden lg:flex md:flex">{item.name}</span>
              
            </a>
          ))}
        </nav>
      </div>
    </div></div>
  )
}

export default mobilesb