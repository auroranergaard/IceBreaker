import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { createNewUser } from "../Utility/DatabaseWriteUtil";

export const doCreateUserWithEmailAndPassword = async (email: string, password: string, username: string) => {
  
  return createUserWithEmailAndPassword(auth, email, password).then((auth) => {
    const userID = auth.user.uid;
    createNewUser(email, username, userID);
  })
  
};

export const currentUserID = async() => { 
  if(auth.currentUser !== null ) {
    return auth.currentUser.uid;
  }
  else {
    return null;
  }
}

export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
}

export const doSignOut = () => {
    return signOut(auth);
};