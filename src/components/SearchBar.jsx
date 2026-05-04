import React from 'react';
import { SearchIcon, SortAscendingIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { Menu } from '@headlessui/react';

const SearchBar = () => {
  return (
    <div className='flex mb-6'>
    <div className="flex-1 flex justify-center lg:justify-end">
      <div className="w-full lg:px-2">
        <label htmlFor="search" className="sr-only">
          Search projects
        </label>
        <div className="relative text-white focus-within:text-gray-400">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm"
            placeholder="Search projects"
            type="search"
          />
        </div>
      </div>
    </div>

    <Menu as="div" className="relative">
      <Menu.Button className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <SortAscendingIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        Sort
        <ChevronDownIcon className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>
      <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block px-4 py-2 text-sm`}
              >
                Name
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block px-4 py-2 text-sm`}
              >
                Date modified
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block px-4 py-2 text-sm`}
              >
                Date created
              </a>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  </div>   
  );
};

export default SearchBar;
