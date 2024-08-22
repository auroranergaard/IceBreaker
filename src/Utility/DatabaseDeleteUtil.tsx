import { firestore } from '../Firebase/firebase';
import { collection, doc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';
import { getCommentByAuthorAndGameID } from './DatabaseReadUtil';

const gamesReference = collection(firestore, "games");
const usersReference = collection(firestore, "users");
const reportsReference = collection(firestore, "reports");

/**
 * Deletes a game from the database based on the gameID. 
 * CANNOT BE UNDONE
 * @param reportID 
 * @returns error if the game could not be deleted
 */
export function deleteGame(gameID: string) {
  let gameIDReference = doc(gamesReference, gameID);
  try {
    deleteDoc(gameIDReference);
    return "Successfully deleted game";
  } catch (error) {
    return "Error deleting game: " + error;
  }
}

/**
 * Deletes a user from the database based on the userID. 
 * CANNOT BE UNDONE
 * @param reportID 
 * @returns error if the user could not be deleted
 */
export function deleteUser(userID: string) {
  let userIDReference = doc(usersReference, userID);
  try {
    deleteDoc(userIDReference);
    return "Successfully deleted user";
  } catch (error) {
    return "Error deleting user: " + error;
  }
}

/**
 * Deletes a report from the database based on the reports ID. 
 * CANNOT BE UNDONE
 * @param reportID 
 * @returns error if the report could not be deleted
 */
export async function deleteReport(reportID: string): Promise<string> {
  let reportIDReference = doc(reportsReference, reportID);
  try {
    await deleteDoc(reportIDReference);
    return "Successfully deleted report";
  } catch (error) {
    return "Error deleting report: " + error;
  }
}

/**
 * Deletes a comment from the database.
 * @param {string} uid - The ID of the comment author.
 * @param {string} gameID - The ID of the game associated with the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment is deleted.
 */
export async function deleteComment(uid: string, gameID: string): Promise<void> {
  console.log(uid)
  console.log(gameID)
  const comment = await getCommentByAuthorAndGameID(uid, gameID);
  if (comment) {
    const commentRef = doc(firestore, `comments/${comment.id}`);
    await deleteDoc(commentRef);
  }
}

export async function deleteQueue(queueName: string, userID: string): Promise<string> {
  const userReference = doc(usersReference, userID);
  try {
    await updateDoc(userReference, {
      [`queues.${queueName}`]: deleteField()
    });
    return "Successfully deleted queue";
  } catch (error) {
    return "Error deleting queue: " + error;
  }
}