import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Stack, Textarea, Rating, Tooltip } from "@mantine/core";
import { useState } from "react";
import { createNewComment } from "../../Utility/DatabaseWriteUtil";
import { useAuth } from "../../AuthContext";
import { IconEdit } from "@tabler/icons-react";
import { editComment } from "../../Utility/DatabaseUpdateUtil";

type NewCommentProps = {
    gameID: string;
    Edit: boolean;
    comment?: string;
    rating?: number;
};

function NewComment({ gameID, Edit, comment, rating }: NewCommentProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const [formState, setFormState] = useState({ RatingValue: 0, kommentar: "" });
    const { currentUser } = useAuth();

    const handleSubmit = async (event: any) => {
        if (!Edit) {
            event.preventDefault();
            if (currentUser) {
                createNewComment(
                    currentUser.uid,
                    formState.kommentar,
                    gameID,
                    formState.RatingValue
                );
            } else {
                console.error("No user is logged in");
            }
            close();
        } else {
            event.preventDefault();
            if (currentUser) {
                editComment(
                    currentUser.uid,
                    gameID,
                    formState.kommentar,
                    formState.RatingValue
                );
            } else {
                console.error("No user is logged in");
            }
            close();
        }
    };

    const handleRatingChange = (value: number) => {
        setFormState((prevState) => ({ ...prevState, RatingValue: value }));
    };

    const handleCommentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormState((prevState) => ({
            ...prevState,
            kommentar: event.target.value,
        }));
    };

    if (Edit) {
        return (
            <>
                <Modal opened={opened} onClose={close} title="Endre kommentar">
                    <form onSubmit={handleSubmit}>
                        <Stack>
                            <Rating
                                color="#424874"
                                value={formState.RatingValue}
                                onChange={handleRatingChange}
                            />
                            <Textarea
                                value={formState.kommentar}
                                label="Kommentar"
                                withAsterisk
                                onChange={handleCommentChange}
                            />
                            <Button
                                type="submit"
                                color="#424874"
                                style={{ width: "150px" }}
                            >
                                Ferdig
                            </Button>
                        </Stack>
                    </form>
                </Modal>
                <Tooltip label="Endre kommentar" withArrow>
                    <Button
                        color="#a6b1e1"
                        variant="transparent"
                        style={{ marginTop: "5px" }}
                        onClick={() => {
                            console.log(`rating: ${rating}, comment: ${comment}`);
                            open();
                            setFormState({
                                RatingValue: rating ?? 0,
                                kommentar: comment ?? "",
                            });
                        }}
                    >
                        <IconEdit stroke={1} />
                    </Button>
                </Tooltip>
            </>
        );
    } else {
        return (
            <>
                <Modal opened={opened} onClose={close} title="Ny kommentar">
                    <form onSubmit={handleSubmit}>
                        <Stack>
                            <Rating
                                color="#424874"
                                value={formState.RatingValue}
                                onChange={handleRatingChange}
                            />
                            <Textarea
                                value={formState.kommentar}
                                label="Kommentar"
                                withAsterisk
                                onChange={handleCommentChange}
                            />
                            <Button
                                type="submit"
                                color="#424874"
                                style={{ width: "150px" }}
                            >
                                Ferdig
                            </Button>
                        </Stack>
                    </form>
                </Modal>
                <Tooltip label="Legg til kommentar" withArrow>
                    <Button
                        color="#424874"
                        variant="filled"
                        style={{ marginTop: "5px" }}
                        onClick={() => {
                            open();
                            setFormState({ RatingValue: 0, kommentar: "" });
                        }}
                    >
                        Ny kommentar
                    </Button>
                </Tooltip>
            </>
        );
    }
}

export default NewComment;