import { firestore } from "../Firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  DocumentReference,
  QueryDocumentSnapshot,
  DocumentData,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";

const gamesReference = collection(firestore, "games");
const usersReference = collection(firestore, "users");
const reportsReference = collection(firestore, "reports");

interface Game {
  author: string,
  category: string,
  description: string,
  gameID: string,
  image: string,
  name: string,
  ratings: number[],
  tags: string[]
};

interface Report {
  comment: string,
  gameID: string,
  reportID: string,
  commentid: DocumentReference,
  reportText: string,
  reportingUid: string,
};

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

/**
 * Subscribes to updates in the "games" collection in the Firestore database.
 * 
 * @param handleUpdate - A callback function that will be called whenever there are updates to the games collection.
 *                       It receives an array of Game objects as a parameter.
 * @returns A function that can be called to unsubscribe from the updates.
 */
export function subscribeToGamesUpdates(handleUpdate: (games: Game[]) => void) {
  const gamesRef = collection(firestore, "games");
  const unsubscribe = onSnapshot(gamesRef, (snapshot) => {
    const fetchedGames = snapshot.docs.map(doc => doc.data() as Game);
    handleUpdate(fetchedGames);
  });

  return unsubscribe;
}

/**
 * Get all games from the database
 * @returns all the games in the database as an array
 */
export async function getAllGames(): Promise<Game[]> {
  let games: Game[] = [];
  try {
    const snapshot = await getDocs(gamesReference);
    snapshot.forEach((document) => {
      const gamesData: Game = document.data() as Game;
      games.push(gamesData);
    });
    return games;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

/**
 * Get all games from the database by their category
 * @param category to fetch games from
 * @returns all the games in the database as an array
 */
export function getGamesByCategory(category: string) {
  let games: Game[] = [];
  const categoryQuery = query(
    gamesReference,
    where("category", "==", category)
  );
  getDocs(categoryQuery).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      const gamesInCategory: Game = document.data() as Game;
      games.push(gamesInCategory);
    });
    return games;
  });
}

/**
 * Retrieves the name of a game by its ID.
 * @param gameID - The ID of the game.
 * @returns A Promise that resolves to the name of the game.
 */
export async function getGameNameByID(gameID: string): Promise<string | null> {
  const gameDocRef = doc(gamesReference, gameID);
  const gameDoc = await getDoc(gameDocRef);
  if (gameDoc.exists()) {
    const gameData: Game = gameDoc.data() as Game;
    return gameData.name;
  } else {
    console.log("No such document!");
    return null;
  }
}

/**
 * Get a game from the database by it's id
 * @param id of game to fetch
 * @returns a Game object with the data of the game with the corresponding ID
 */
export async function getGameByID(gameID: string): Promise<Game | undefined> {
  const gameIDQuery = query(gamesReference, where("gameID", "==", gameID));
  const gameIDSnapshot = await getDocs(gameIDQuery);
  const document = gameIDSnapshot.docs[0];

  return document ? (document.data() as Game) : undefined;
}

/**
 * Get a user from the database by their email
 * @param email of user to find
 * @returns user as object
 */
export function getUserByEmail(email: string) {
  let user: User;
  const userQuery = query(usersReference, where("email", "==", email));
  getDocs(userQuery).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      const userData: User = document.data() as User;
      user = userData;
    });
    console.log(user);
    return user;
  });
}

/**
 * Get a user from the database by their username
 * @param username
 * @returns user as object
 */
export function getUserByUsername(username: string) {
  let user: User;
  const userQuery = query(usersReference, where("username", "==", username));
  getDocs(userQuery).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      const userData: User = document.data() as User;
      user = userData;
    });
    return user;
  });
}

/**
 * Get all the games that a user has favorited
 * @param uid of user to fetch favorites from
 * @returns all the games in the users favorite list as an array of game ids
 */
export function getFavoritesByUser(uid: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const userDocRef = doc(usersReference, uid);

    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const favorites = userData.favorites ? userData.favorites : [];
          resolve(favorites);
        } else {
          console.log("No such document!");
          resolve([]); // Resolve with an empty array if the document does not exist
        }
      })
      .catch((error) => {
        console.error("Error getting document: ", error);
        reject(error);
      });
  });
}

/**
 * Retrieves the username associated with a given user ID.
 * @param uid - The user ID as a DocumentReference object.
 * @returns A Promise that resolves to the username associated with the user ID.
 */
export async function getUsernameByID(uid: DocumentReference) {
  const user = doc(usersReference, uid.id);
  const username = await getDoc(user).then((snapshot) => {
    const userData = snapshot.data();
    return userData?.username;
  });
  return username;
}

/**
 * Retrieves all reports from the database.
 * @returns An array of reports.
 */
export async function getAllReports() {
  let reports: Report[] = [];
  try {
    const snapshot = await getDocs(reportsReference);
    snapshot.forEach((document) => {
      const reportsData: Report = document.data() as Report;
      reports.push(reportsData);
    });
    return reports;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

export async function getUserQueues(uid: string) {
  const userDocRef = doc(usersReference, uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData.queues;
  } else {
    console.log("No such document!");
    return {};
  }
}

/**
 * Retrieves comments by game ID from the database.
 * @param gameID - The ID of the game.
 * @returns An array of comments.
 */
export async function getCommentsByGameID(gameID: string) {
  const comments: Comment[] = [];
  const commentsReference = collection(firestore, "comments"); // Define the comments reference
  const commentQuery = query(commentsReference, where("gameID", "==", gameID)); // Query the comments reference
  await getDocs(commentQuery).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      const commentData: Comment = document.data() as Comment;
      comments.push(commentData);
    });
  });
  return comments;
}

/**
 * Retrieves a comment by author and game ID from the database.
 *
 * @param uid - The ID of the author.
 * @param gameID - The ID of the game.
 * @returns A promise that resolves to an object containing the ID and data of the comment, or null if no comment is found.
 */
export async function getCommentByAuthorAndGameID(
  uid: string,
  gameID: string
): Promise<{ id: string; data: Comment } | null> {
  const commentsReference = collection(firestore, "comments");
  const userDocRef = doc(usersReference, uid);
  const commentQuery = query(
    commentsReference,
    where("gameID", "==", gameID),
    where("author", "==", userDocRef)
  );
  const querySnapshot = await getDocs(commentQuery);
  if (!querySnapshot.empty) {
    const commentDoc: QueryDocumentSnapshot<DocumentData> =
      querySnapshot.docs[0];
    const commentData: Comment = commentDoc.data() as Comment;
    return { id: commentDoc.id, data: commentData };
  } else {
    return null;
  }
}


/**
 * Retrieves all comments made by a user.
 * @param uid - The ID of the user.
 * @returns A function to unsubscribe from the comments updates.
 */
export function getCommentsByAuthor(uid: string, callback: (comments: Comment[]) => void) {
  const commentsReference = collection(firestore, "comments");
  const userDocRef = doc(usersReference, uid);
  const commentQuery = query(commentsReference, where("author", "==", userDocRef));

  const unsubscribe = onSnapshot(commentQuery, (querySnapshot) => {
    const comments: Comment[] = [];
    querySnapshot.forEach((document) => {
      const commentData: Comment = document.data() as Comment;
      comments.push(commentData);
    });
    callback(comments);
  });

  return unsubscribe;
}

/**
 * Retrieves comment by reference from the database.
 * @param reference - The reference to the comment.
 * @returns A comment object.
 */
export async function getCommentByReference(reference: DocumentReference): Promise<Comment> {
  const result: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(reference);
  const commentData = result.data() as Comment;
  return commentData;
}