import { firestore } from '../Firebase/firebase';
import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getCommentByAuthorAndGameID } from './DatabaseReadUtil';

const gamesReference = collection(firestore, "games");
const usersReference = collection(firestore, "users");
const reportsReference = collection(firestore, "reports");

export function updateGameID(gameID: string) {
    let gameIDReference = doc(gamesReference, gameID);
    updateDoc(gameIDReference, {
        gameID: gameID
    });
}
/**
 * 
 * @param reportID 
 */
export function updateReportID(reportID: string) {
    let reportIDReference = doc(reportsReference, reportID);
    updateDoc(reportIDReference, {
        reportID: reportID
    });

}

/**
 * Update the current user's favorite games
 * @param userID the uid of the user to update
 * @param gameID the gameID to add to the user's favorites
 */
export function updateUserFavorites(userID: string, gameID: string) {
    let userReference = doc(usersReference, userID);
    getDoc(userReference).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            let user = docSnapshot.data();
            
            if (!user.favorites.includes(gameID)) {
                user.favorites.push(gameID);
                updateDoc(userReference, {
                    favorites: user.favorites
                }).then(() => {
                    console.log("Favorites updated successfully");
                }).catch((error) => {
                    console.error("Error updating favorites:", error);
                });
            } else {
                console.log("GameID already in favorites");
            }
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

/**
 * Remove a gameID from the current user's favorite games
 * @param userID the uid of the user to update
 * @param gameID the gameID to remove from the user's favorites
 */
export function removeUserFavorite(userID: string, gameID: string) {
    let userReference = doc(usersReference, userID);
    getDoc(userReference).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            let user = docSnapshot.data();
            // Check if the gameID is in the favorites array
            if (user.favorites && user.favorites.includes(gameID)) {
                // Filter out the gameID to be removed
                const updatedFavorites = user.favorites.filter((id: string) => id !== gameID);
                updateDoc(userReference, {
                    favorites: updatedFavorites
                }).then(() => {
                    console.log("Favorite removed successfully");
                }).catch((error) => {
                    console.error("Error removing favorite:", error);
                });
            } else {
                console.log("GameID not found in favorites");
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

/**
 * Edits a comment in the database.
 * @param {string} commentText - The new text for the comment.
 * @param {number} rating - The new rating for the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment is edited.
 */
export async function editComment(uid: string, gameID: string, commentText: string, rating: number): Promise<void> {
    const comment = await getCommentByAuthorAndGameID(uid, gameID);
    if (comment) {
      const commentRef = doc(firestore, `comments/${comment.id}`);
      await updateDoc(commentRef, { text: commentText, rating: rating });
    }
}

/**
 * Update the user's queue
 * @param userID the uid of the user to update
 * @param gameID the gameID to add to the user's queue
 */
export async function updateUserQueue(userID: string, gameID: string, queueName: string) {
    const userReference = doc(usersReference, userID);
    const userDoc = await getDoc(userReference);

    if (userDoc.exists()) {
        let user = userDoc.data();
        // Check if `queues` exists and is an object; if not, initialize it
        user.queues = user.queues || {};
        // Check if the queue exists
        if (!user.queues[queueName]) {
            // Queue does not exist, so create it and add the gameID
            user.queues[queueName] = [gameID];
        } else {
            // Queue exists, so add the gameID only if it's not already there
            if (!user.queues[queueName].includes(gameID)) {
                user.queues[queueName].push(gameID);
            } else {
                // gameID already exists in the queue
                console.log("GameID already in queue");
                return; // Exit the function to avoid unnecessary updates
            }
        }
        // Update the document
        updateDoc(userReference, {
            queues: user.queues
        }).then(() => {
            console.log("Queue updated successfully");
        }).catch((error) => {
            console.error("Error updating queue:", error);
        });
    } else {
        console.log("User does not exist");
    }
}