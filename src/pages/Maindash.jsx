import React from "react";
import DashHeader from "@/components/DashHeader";
import Calendar from "@/components/Calendar";
import SubjectStudentReport from "@/components/SubjectStudentResult";
import Studentsoverview from "@/components/MStudentsoverview";
import MNotifiations from "@/components/MNotifiations";
import MDocuments from "@/components/MDocuments";
import MClasses from "@/components/MClasses";
import Msubjects from "@/components/MSubjects";

const Maindash = () => {
  return (
    <div className="overflow-y-auto h-full rounded-lg bg-indigo-50 p-4 pb-24 m-4">
      <div className="md:flex-col lg-flex gap-4 sm:block">
        <div className="flex-1">
          <Studentsoverview />
        </div>

        
      </div>

      <div className="mt-2 flex-col">
        <div className="flex-1 sm:block">
 
        <MClasses />
        <Msubjects />
      
          
        </div>
        <div className="flex-1 lg:w md:w-full sm:w-full">
          <MNotifiations />
        </div>
      </div>

    
    </div>
  );
};

export default Maindash;
