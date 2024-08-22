import { Group, ScrollArea, Stack, Text, Title, Tooltip } from "@mantine/core";
import Header from "../Components/Header";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import {
    getCommentsByAuthor,
    getUsernameByID,
    getGameNameByID,
} from "../Utility/DatabaseReadUtil";
import Comment from "../Components/Comment/Comment";

function UserRatings() {
    const { currentUser } = useAuth(); // get the current user from the AuthProvider
    const [comments, setComments] = useState<Array<{ [key: string]: any }>>([]);
    const [gameID, setGameID] = useState<Array<{ gameID: string }>>([]);
    const navigate = useNavigate();

    const handleNavigate = (gameID: string) => {
        navigate(`/game/${gameID}`);
    };

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = getCommentsByAuthor(
                currentUser.uid,
                async (fetchedComments) => {
                    if (Array.isArray(fetchedComments)) {
                        const fetchedUsernames = await Promise.all(
                            fetchedComments.map((comment) => getUsernameByID(comment.author)) // get username by author's id
                        );
                        const fetchedGameNames = await Promise.all(
                            fetchedComments.map((comment) => getGameNameByID(comment.gameID)) // get game name by game id
                        );
                        const commentsWithUsernamesAndGameNames = fetchedComments.map(
                            (comment, index) => ({
                                ...comment,
                                username: fetchedUsernames[index], // add username to each comment
                                gameName: fetchedGameNames[index], // add game name to each comment
                            })
                        );
                        setComments(commentsWithUsernamesAndGameNames);
                    } else {
                        console.error("fetchedComments is not an array:", fetchedComments);
                    }
                }
            );

            // Clean up the subscription on unmount
            return () => unsubscribe();
        }
    }, [currentUser]);

    return (
        <Stack>
            <Header></Header>
            <Stack align="center" justify="flex-start"></Stack>
            <ScrollArea h={600}>
                <Group p={20} justify="center">
                    <Stack align="center">
                        <Title>Vurderinger</Title>
                        {comments.map((comment) => (
                            <>
                                <Tooltip label="Klikk for å se spillet">
                                    <Text onClick={() => handleNavigate(comment.gameID)}>{comment.gameName}</Text>
                                </Tooltip>
                                <Comment
                                    gameID={comment.gameID}
                                    uid={comment.author.id}
                                    username={comment.username}
                                    profilePicture="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                                    comment={comment.text}
                                    rating={comment.rating}
                                ></Comment>
                            </>
                        ))}
                    </Stack>
                </Group>
            </ScrollArea>
        </Stack>
    );
}

export default UserRatings;
