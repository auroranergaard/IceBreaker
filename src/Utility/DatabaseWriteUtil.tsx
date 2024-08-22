import { comment } from "postcss";
import { firestore } from "../Firebase/firebase";
import {
  getCommentByAuthorAndGameID,
  getCommentsByGameID,
} from "./DatabaseReadUtil";
import { updateGameID, updateReportID } from "./DatabaseUpdateUtil";
import {
  collection,
  setDoc,
  addDoc,
  doc,
  DocumentReference,
} from "firebase/firestore";

const gamesReference = collection(firestore, "games");
const usersReference = collection(firestore, "users");
const reportsReference = collection(firestore, "reports");

interface Game {
  author: string;
  category: string;
  description: string;
  gameID: string;
  image: string;
  name: string;
  ratings: number[];
  tags: string[];
}
[] = [];

interface User {
  email: string;
  favorites: string[];
  username: string;
}

interface Comment {
  author: DocumentReference;
  text: string;
  gameID: string;
  rating: number;
}

interface Report {
  reportText: string;
  reportingUid: string;
  commentid: DocumentReference;
  reportID: string;
}

/**
 * Create a new game in the database
 * @param author author of the game as a string
 * @param category category of the game as a string
 * @param description description of the game as a string
 * @param image game image as a Data URL string
 * @param name name of the game as a string
 * @param ratings all the ratings of the game as an array
 * @param tags gametags as an array
 * @returns the gameID of the new game
 */
export function createNewGame(
  //TODO: Implement author later
  //author: string, // Causes a lot of problems
  category: string,
  description: string,
  image: string,
  name: string,
  link: string,
  ratings?: number[],
  tags?: string[]) {
  if (ratings == undefined) {
    ratings = [];
  }
  if (tags == undefined) {
    tags = [];
  }
  const game = {
    //author: author,
    category: category,
    description: description,
    gameID: "",
    image: image,
    name: name,
    link: "",
    tags: tags,
    ratings: ratings
  }
  let gameID = addDoc(gamesReference, game);

  gameID.then((documentReference) => {
    updateGameID(documentReference.id);
    return documentReference.id;
  });
}

export function createNewUser(email: string, username: string, uid: string) {
  const user = {
    username: username,
    email: email,
    favorites: [],
    queues: {},
  }
  const documentReference = doc(usersReference, uid);
  setDoc(documentReference, user);
}

export function createNewReport(comment: string, gameID: string) {
  const report = {
    comment: comment,
    reportID: "",
    gameID: gameID
  }
  let reportID = addDoc(reportsReference, report);

  reportID.then((documentReference) => {
    updateReportID(documentReference.id);
    return documentReference.id;
  })
}

/**
 * Creates a new comment and adds it to the Firestore database.
 * @param {string} uid - The user ID of the comment author.
 * @param {string} text - The text content of the comment.
 * @param {string} gameID - The ID of the game the comment is associated with.
 * @param {number} rating - The rating given to the game by the author of the comment.
 */
export function createNewComment(
  uid: string,
  text: string,
  gameID: string,
  rating: number
) {
  const ExistingComments = getCommentsByGameID(gameID);
  ExistingComments.then((comments) => {
    if (
      comments === undefined ||
      comments.some((comment) => comment.author.id === uid)
    ) {
      return;
    }
    const userReference = doc(firestore, `users/${uid}`);
    const comment: Comment = {
      author: userReference,
      text: text,
      gameID: gameID,
      rating: rating,
    };
    addDoc(collection(firestore, "comments"), comment);
  });
}

export async function reportComment(uid: string, gameID: string, reportingUid: string, reportText: string) {
  const comment = await getCommentByAuthorAndGameID(uid, gameID);
  if (comment) {
    const commentRef = doc(firestore, `comments/${comment.id}`);
    const report: Report = {
      reportText: reportText,
      reportingUid: reportingUid,
      commentid: commentRef,
      reportID: ''
    };
    let reportID = addDoc(collection(firestore, "reports"), report);

    reportID.then((documentReference) => {
      updateReportID(documentReference.id);
      return documentReference.id;
    })
  } else {
    console.error('Comment not found');
  }
}