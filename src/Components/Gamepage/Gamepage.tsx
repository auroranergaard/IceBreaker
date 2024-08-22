import { useState, useEffect } from "react";
import {
    Stack,
    Text,
    Title,
    Image,
    Button,
    Group,
    Rating,
    useMantineColorScheme,
    Modal,
    Select,
    TextInput,
    Tooltip
} from "@mantine/core";
import { IconHeartFilled, IconPlaylistAdd } from "@tabler/icons-react";
import { useAuth } from "../../AuthContext";
import {
    getCommentsByGameID,
    getFavoritesByUser,
} from "../../Utility/DatabaseReadUtil";
import {
    removeUserFavorite,
    updateUserFavorites,
} from "../../Utility/DatabaseUpdateUtil";
import RapporterLek from "../Rapportering/RapportLek";
import { getUserQueues } from '../../Utility/DatabaseReadUtil';
import { updateUserQueue } from '../../Utility/DatabaseUpdateUtil';

type GamePageProps = {
    name: string;
    description: string;
    gameID: string;
    image: string;
    like?: boolean;
    displayLike?: boolean;
    displayReport?: boolean;
    displayAdd?: boolean;
    onLikeClick: () => void;
};

const Gamepage = ({
    name,
    description,
    gameID,
    image,
    displayLike = true,
    displayReport = true,
    displayAdd = true,
}: GamePageProps) => {
    const { colorScheme } = useMantineColorScheme();
    const { currentUser } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [queues, setQueues] = useState<string[]>([]);
    const [queueToUpdate, setQueueToUpdate] = useState<string>("");
    const [newQueue, setNewQueue] = useState<string>("");
    const [emptyQueue, setEmptyQueue] = useState(false);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        const fetchAvgRating = async () => {
            const comments = await getCommentsByGameID(gameID);
            if (comments && comments.length > 0) {
                const totalRating = comments.reduce(
                    (total, comment) => total + comment.rating,
                    0
                );
                const fetchedAvgRating = totalRating / comments.length;
                setAvgRating(fetchedAvgRating);
            }
        };

        fetchAvgRating();
    }, [gameID]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (currentUser) {
                const userFavorites = await getFavoritesByUser(currentUser.uid);
                setIsFavorite(userFavorites.includes(gameID));
            }
        };

        fetchFavorites();
    }, [currentUser, gameID]);

    const handleFavoriteToggle = async () => {
        if (!currentUser) return;
        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);

        try {
            if (newIsFavorite) {
                await updateUserFavorites(currentUser.uid, gameID);
            } else {
                await removeUserFavorite(currentUser.uid, gameID);
            }
            console.log(
                `Favorite status updated: ${newIsFavorite ? "Added to" : "Removed from"
                } favorites.`
            );
        } catch (error) {
            console.error("Failed to update favorite status", error);
            setIsFavorite(!newIsFavorite);
        }
    };

    useEffect(() => {
        const fetchQueues = async () => {
            const userQueues = await getUserQueues(currentUser!.uid);
            // Convert object keys to the array format expected by the Select component
            const queueOptions = Array.from(Object.keys(userQueues));
            setQueues(queueOptions);
            if (queueOptions.length === 0) {
                setEmptyQueue(true);
            }
        };
        fetchQueues();
    }, [currentUser, queueToUpdate, newQueue]);

    useEffect(() => {
        const fetchQueues = async () => {
            const userQueues = await getUserQueues(currentUser!.uid);
            // Convert object keys to the array format expected by the Select component
            const queueOptions = Array.from(Object.keys(userQueues));
            setQueues(queueOptions);
            if (queueOptions.length === 0) {
                setEmptyQueue(true);
            }
        };
        fetchQueues();
    }, [currentUser, queueToUpdate, newQueue]);

    const handleOpen = () => {
        setModalOpened(true);
    };

    const SubmitExisting = async (event: any) => {
        event.preventDefault();

        await updateUserQueue(currentUser!.uid, gameID, queueToUpdate);
        setModalOpened(false);
    };

    const SubmitNew = async (event: any) => {
        event.preventDefault();

        await updateUserQueue(currentUser!.uid, gameID, newQueue);
        setModalOpened(false);
    };

    return (
        <Stack align="center">
            <Group justify='center'>
                <Title ta="center" order={1}>
                    {name}
                </Title>
                
                {displayAdd && <Rating value={avgRating} readOnly color="#a6b1e1"></Rating>}

                {displayLike && currentUser && (
                    <Tooltip
                        label="Legg til i favoritter"
                        withArrow
                    >
                        <Button w={60} onClick={handleFavoriteToggle} color="#424874">
                            <IconHeartFilled style={{ color: isFavorite ? "red" : "white" }} />
                        </Button>
                    </Tooltip>
                )}

                {displayAdd && currentUser && (
                    <Tooltip
                        label="Legg til i kø"
                        withArrow
                    >
                        <Button w={60} onClick={handleOpen} color="#424874">
                            <IconPlaylistAdd />
                        </Button>
                    </Tooltip>
                )}

                {displayReport && currentUser && <RapporterLek gameId={gameID} />}

            </Group>
            <Image h={displayAdd ? 300 : 150} w={displayAdd ? 600 : 300} radius="md" src={image} />
            <Text ta="center" size="lg">{description}</Text>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Legg til i eksisterende kø"
            >
                <Stack align='center'>
                    <form onSubmit={(event) => SubmitExisting(event)}>
                        <Stack align='center'>
                            <Text>Velg en kø å legge icebreakeren til i:</Text>
                            <Select id='queue-select'
                                disabled={emptyQueue}
                                w={"100%"}
                                checkIconPosition="right"
                                label="Velg en kø"
                                placeholder={emptyQueue ? "Du har ingen kø" : "Legg til i kø"}
                                required
                                data={queues.map((name) => ({ value: name, label: name }))}
                                value={queueToUpdate}
                                onSearchChange={setQueueToUpdate}
                            ></Select>
                            <Group justify='center' bottom={20}>
                                <Button
                                    disabled={emptyQueue}
                                    type="submit"
                                    color="#424874"
                                    style={{ width: "150px", marginTop: "10px" }}
                                >
                                    {emptyQueue ? "Du har ingen kø" : "Legg til i kø"}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                    <form onSubmit={(event) => SubmitNew(event)}>
                        <Stack align='center'>
                            <Text>Eller legg til i en ny kø:</Text>
                            <TextInput
                                w={"100%"}
                                placeholder='Kønavn'
                                label='Ny kø'
                                required
                                value={newQueue}
                                onChange={(event) => setNewQueue(event.currentTarget.value)}
                            />
                            <Group justify='center'>
                                <Button
                                    type="submit"
                                    color="#424874"
                                    style={{ width: "150px", marginTop: "10px" }}
                                    onClick={(event) => SubmitNew(event)}
                                >
                                    Legg til i ny kø
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            </Modal>
        </Stack>
    );
};

export default Gamepage;
