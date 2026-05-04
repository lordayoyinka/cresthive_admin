import React, {useState} from "react";
import Loading from "@/components/Loading";

const CmsPage = () => {

  const [loader, setloader] = useState(false);



  return (
    <div className="overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <a onClick={()=>setloader(true)} href={`./CmsIndex`}>
        <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
          Cms Index Page
        </div>
      </a>

      <a onClick={()=>setloader(true)} href={`./CmsAbout`}>
        <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
          Cms About Page
        </div>
      </a>

      <a onClick={()=>setloader(true)} href={`./CmsAdmissions`}>
        <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
          Cms Admissions Page
        </div>
      </a>

      <a onClick={()=>setloader(true)} href={`./CmsBasic`}>
        <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
        Cms Basics Page
        </div>
      </a>

      <a onClick={()=>setloader(true)} href={`./CmsSecondary`}>
        <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
        Cms College Page
        </div>
      </a>

      <a onClick={()=>setloader(true)} href={`./CmsGallery`}>
        <div className="w-full py-8 text-xl text-slate-600 font-semibold drop-shadow-xl px-10 rounded-xl bg-white my-10 ">
        Cms Gallery Page
        </div>
      </a>


      <div className="absolute top-0 left-0">
        <Loading newstate={loader} />
        </div>

      
    </div>
  );
};

export default CmsPage;
