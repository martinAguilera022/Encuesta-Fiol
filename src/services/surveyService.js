import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";

export const createSurvey = async (surveyData) => {
  try {
    const docRef = await addDoc(collection(db, "surveys"), {
      ...surveyData,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la encuesta:", error);
    throw error;
  }
};