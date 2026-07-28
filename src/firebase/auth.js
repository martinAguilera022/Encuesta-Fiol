import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";

import { app } from "./config";

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => {
	return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
	return signOut(auth);
};

export { auth };
