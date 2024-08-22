import { Box, Container, Group, Stack, Title } from "@mantine/core";
import Header from "../Components/Header";
import Gamepage from "../Components/Gamepage/Gamepage";
import Comment from "../Components/Comment/Comment";
import NewComment from "../Components/Comment/NewComment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateUserFavorites } from "../Utility/DatabaseUpdateUtil";
import { getGameByID, getUsernameByID } from "../Utility/DatabaseReadUtil";
import { useAuth } from "../AuthContext";
import { firestore } from "../Firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Timer from "../Components/Gamepage/Timer";

type GameData = {
  name: string;
  gameID: string;
  description: string;
  image: string;
};

function Game() {
  const { gameID } = useParams<{ gameID: string }>();
  const { currentUser } = useAuth();
  const userID = currentUser?.uid;
  const [gameData, setGameData] = useState<GameData>();

  const [like, setLike] = useState(false);
  const [comments, setComments] = useState<Array<{ [key: string]: any }>>([]);
  const [userHasCommented, setUserHasCommented] = useState(false);

  const checkUserComment = (comments: Array<{ [key: string]: any }>) => {
    const userCommentExists = comments.some(
      (comment) => comment.author.id === userID
    );
    setUserHasCommented(userCommentExists);
  };

  useEffect(() => {
    const fetchGameData = async () => {
      if (gameID) {
        try {
          const data = (await getGameByID(gameID)) as GameData;
          setGameData(data);
        } catch (error) {
          console.error("Failed to fetch game data", error);
        }
      }
    };
    const commentsRef = collection(firestore, "comments");
    const q = query(commentsRef, where("gameID", "==", gameID));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => doc.data());
      if (Array.isArray(fetchedComments)) {
        const fetchedUsernames = await Promise.all(
          fetchedComments.map((comment) => getUsernameByID(comment.author)) // get username by author's id
        );
        const commentsWithUsernames = fetchedComments.map((comment, index) => ({
          ...comment,
          username: fetchedUsernames[index], // add username to each comment
        }));
        fetchGameData();
        setComments(commentsWithUsernames);
        checkUserComment(commentsWithUsernames);
      } else {
        console.error("fetchedComments is not an array:", fetchedComments);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [gameID, userID]);

  const handleLikeClick = async () => {
    const newLikeStatus = !like;
    setLike(newLikeStatus);
    if (newLikeStatus && gameID && userID) {
      try {
        await updateUserFavorites(userID, gameID);
      } catch (error) {
        setLike(!newLikeStatus);
      }
    }
  };

  return (
    <Box>
      <Header></Header>
      <Container p="sm" size="sm">
        <Stack>
          <Group justify="center">
            {gameData && (
              <Gamepage
                name={gameData.name}
                gameID={gameData.gameID}
                description={gameData.description}
                image={gameData.image}
                like={like}
                onLikeClick={handleLikeClick}
              ></Gamepage>
            )}
          </Group>
          <Timer></Timer>
          <Stack align="center">
            <Group>
              <Title>Vurderinger</Title>
              {currentUser && !userHasCommented && (
                <NewComment Edit={false} gameID={gameID || ''} />
              )}
            </Group>
            {gameID && comments.map((comment) => (
              <Comment
                gameID={gameID}
                uid={comment.author.id}
                username={comment.username}
                profilePicture="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                comment={comment.text}
                rating={comment.rating}
              ></Comment>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Game;
