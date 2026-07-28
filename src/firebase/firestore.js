import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	serverTimestamp,
	query,
	orderBy,
} from "firebase/firestore";

import { app } from "./config";

const db = getFirestore(app);

export { db, collection, addDoc, getDocs, serverTimestamp, query, orderBy };
