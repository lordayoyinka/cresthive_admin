import React from "react";
// import { Progress } from "react-sweet-progress";
// import "react-sweet-progress/lib/style.css";

const MGuagechart = () => {
  return (
    <div className="flex-col w-full bg-white py-2 rounded-lg">
      <h2 className="text-lg font-semibold text-slate-500 mx-6 mt-4">
        Overall Performance
      </h2>

      <div className="sm:block my-4 md:flex lg:flex gap-2 h-fit ">
        {/* <div className="flex-1  justify-center">
          <Progress
            
            theme={{
              success: {
                color: "rgb(223, 105, 180)",
              },
              active: {
                color: "#fbc630",
              },
              default: {
                color: "#fbc630",
              },
            }}
            percent={80}
            type="circle"
          />
        </div>

        <div className="flex-1 md:mt-0 lg:mt-0 mt8">
          <Progress
            className="sm:mt-8"
            theme={{
              success: {
                color: "rgb(223, 105, 180)",
              },
              active: {
                color: "#fbc630",
              },
              default: {
                color: "#fbc630",
              },
            }}
            percent={100}
            type="circle"
          />
        </div> */}
      </div>
    </div>
  );
};

export default MGuagechart;
