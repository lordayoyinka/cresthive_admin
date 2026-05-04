import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { getFirestore, updateDoc, doc, getDoc } from "firebase/firestore";
import { data } from "autoprefixer";
import { useRouter } from "next/router";

const ReportActivity = () => {

  const year = localStorage.getItem("year");
  const term = localStorage.getItem("term");




  const [activitiesextra, setActivitiesextra] = useState([]);
  const [activitiespsycho, setActivitiespsycho] = useState([]);
  const [activitiesaffect, setActivitiesaffect] = useState([]);
  const [activitiesclubs, setActivitiesclubs] = useState([]);
  const [activitiessports, setActivitiessports] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const { user } = router.query;
    if (user) {
      setuid(user);
    }
  }, [router.query]);

  const [uid, setuid] = useState("");

  const dbase = getFirestore();

  useEffect(() => {
    const fetchExtracurricularData = async () => {
      if (uid) {
        const extraPath = `students/${uid}`;
        const extraDocRef = doc(dbase, year, term, extraPath);
        const extraDoc = await getDoc(extraDocRef);

        const dataextra = extraDoc.data();
        const extraCurricularlist = dataextra.extraCurricular;

        if (extraCurricularlist) {
          setActivitiesextra(dataextra.extraCurricular);
        }
      }
    };

    fetchExtracurricularData();

    // club data start

    const fetchClubData = async () => {
      if (uid) {
        const extraPath = `students/${uid}`;
        const extraDocRef = doc(dbase, year, term, extraPath);
        const extraDoc = await getDoc(extraDocRef);

        const dataextra = extraDoc.data();
        const Clubslist = dataextra.clubs;

        if (Clubslist) {
          setActivitiesclubs(dataextra.clubs);
        }
      }
    };

    fetchClubData();

    // club data end

    // sports data start

    const fetchSportsData = async () => {
      if (uid) {
        const extraPath = `students/${uid}`;
        const extraDocRef = doc(dbase, year, term, extraPath);
        const extraDoc = await getDoc(extraDocRef);

        const dataextra = extraDoc.data();
        const Sportslist = dataextra.sports;

        if (Sportslist) {
          setActivitiessports(dataextra.sports);
        }
      }
    };

    fetchSportsData();

    // sports data end

    const fetchPsychomotorData = async () => {
      if (uid) {
        const extraPath = `students/${uid}`;
        const extraDocRef = doc(dbase, year, term, extraPath);
        const psychoDoc = await getDoc(extraDocRef);

        const datapsycho = psychoDoc.data();
        const psychomotorList = datapsycho.psychomotor;

        if (psychomotorList) {
          setActivitiespsycho(psychomotorList);
        }
      }
    };

    fetchPsychomotorData();

    const fetchAffectiveData = async () => {
      if (uid) {
        const extraPath = `students/${uid}`;
        const extraDocRef = doc(dbase, year, term, extraPath);
        const affectDoc = await getDoc(extraDocRef);

        const dataaffect = affectDoc.data();
        const affectList = dataaffect.affective;

        if (affectList) {
          setActivitiesaffect(affectList);
        }
      }
    };

    fetchAffectiveData();
  }, [uid]);

  



  const handleScoreChangeSports = (activityIndex, score) => {
    const updatedActivities = activitiessports.map((activity, index) => ({
      ...activity,
      score: index === activityIndex ? score : activity.score,
    }));

    setActivitiessports(updatedActivities);
    saveSportsScore(updatedActivities);
    // Update the record on Firebase here
    // You can use Firebase SDK to update the record in your Firestore database
  };

  const handleScoreChangeClubs = (activityIndex, score) => {
    const updatedActivities = activitiesclubs.map((activity, index) => ({
      ...activity,
      score: index === activityIndex ? score : activity.score,
    }));

    setActivitiesclubs(updatedActivities);
    saveClubsScore(updatedActivities);
    // Update the record on Firebase here
    // You can use Firebase SDK to update the record in your Firestore database
  };


  const handleScoreChangepsycho = (activityIndex, score) => {
    const updatedActivities = activitiespsycho.map((activity, index) => ({
      ...activity,
      score: index === activityIndex ? score : activity.score,
    }));

    setActivitiespsycho(updatedActivities);
    console.log("log this", updatedActivities);
    savePsychoScore(updatedActivities);
    // Update the record on Firebase here
    // You can use Firebase SDK to update the record in your Firestore database
  };

  const handleScoreChangeaffect = (activityIndex, score) => {
    const updatedActivities = activitiesaffect.map((activity, index) => ({
      ...activity,
      score: index === activityIndex ? score : activity.score,
    }));

    setActivitiesaffect(updatedActivities);
    saveaffectScore(updatedActivities);
    // Update the record on Firebase here
    // You can use Firebase SDK to update the record in your Firestore database
  };


  const saveSportsScore = async (updatedActivities) => {
    if (uid) {
      const subjectPath = `students/${uid}`;
      const subjectDocRef = doc(dbase, year, term, subjectPath);
      const subjectDoc = await getDoc(subjectDocRef);
      let extraData = subjectDoc.data();

      await updateDoc(subjectDocRef, { sports: updatedActivities });
    }
  };

  const saveClubsScore = async (updatedActivities) => {
    if (uid) {
      const subjectPath = `students/${uid}`;
      const subjectDocRef = doc(dbase, year, term, subjectPath);
      const subjectDoc = await getDoc(subjectDocRef);
      let extraData = subjectDoc.data();

      await updateDoc(subjectDocRef, { clubs: updatedActivities });
    }
  };


  const savePsychoScore = async (updatedActivities) => {
    if (uid) {
      const subjectPath = `students/${uid}`;
      const subjectDocRef = doc(dbase, year, term, subjectPath);
      const subjectDoc = await getDoc(subjectDocRef);
      let extraData = subjectDoc.data();

      await updateDoc(subjectDocRef, { psychomotor: updatedActivities });
    }
  };

  const saveaffectScore = async (updatedActivities) => {
    if (uid) {
      const subjectPath = `students/${uid}`;
      const subjectDocRef = doc(dbase, year, term, subjectPath);
      const subjectDoc = await getDoc(subjectDocRef);
      let extraData = subjectDoc.data();

      await updateDoc(subjectDocRef, { affective: updatedActivities });
    }
  };

  return (
    <div className="md:p-8 overflow-y-auto h-full md:pb-40 pb-24 p-4">
     

      <h1 className="font-semibold">Psychomotor Activities Scores</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              {[5, 4, 3, 2, 1].map((score) => (
                <TableCell key={score} align="center">
                  {score}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activitiespsycho.map((activity, index) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                {[5, 4, 3, 2, 1].map((score, scoreIndex) => (
                  <TableCell key={score} align="center">
                    <Checkbox
                      checked={activity.score === score}
                      onChange={() => handleScoreChangepsycho(index, score)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h1 className="pt-16">Affective Activities Scores</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              {[5, 4, 3, 2, 1].map((score) => (
                <TableCell key={score} align="center">
                  {score}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activitiesaffect.map((activity, index) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                {[5, 4, 3, 2, 1].map((score, scoreIndex) => (
                  <TableCell key={score} align="center">
                    <Checkbox
                      checked={activity.score === score}
                      onChange={() => handleScoreChangeaffect(index, score)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <h1 className="mt-16 font-semibold">Clubs Scores</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              {[5, 4, 3, 2, 1].map((score) => (
                <TableCell key={score} align="center">
                  {score}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activitiesclubs.map((activity, index) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                {[5, 4, 3, 2, 1].map((score, scoreIndex) => (
                  <TableCell key={score} align="center">
                    <Checkbox
                      checked={activity.score === score}
                      onChange={() => handleScoreChangeClubs(index, score)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>




      <h1 className="mt-16 font-semibold">Sport Activities Scores</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              {[5, 4, 3, 2, 1].map((score) => (
                <TableCell key={score} align="center">
                  {score}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activitiessports.map((activity, index) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.activity}</TableCell>
                {[5, 4, 3, 2, 1].map((score, scoreIndex) => (
                  <TableCell key={score} align="center">
                    <Checkbox
                      checked={activity.score === score}
                      onChange={() => handleScoreChangeSports(index, score)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>







    </div>
  );
};

export default ReportActivity;
