import { Group, Stack, Select, Grid, Button, Text, Tooltip, Modal } from "@mantine/core";
import { IconPlayerPlay, IconRotateClockwise, IconCircleMinus,  } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useAuth } from "../AuthContext/index";
import Queue from "../Components/Queue/Queue";
import Gamepage from "../Components/Gamepage/Gamepage";
import Timer from "../Components/Gamepage/Timer";
import NoQueueFound from "../Components/Queue/NoQueueFound";
import { getGameByID, getUserQueues } from "../Utility/DatabaseReadUtil";
import { deleteQueue } from "../Utility/DatabaseDeleteUtil";

type Game = {
    author: string;
    category: string;
    description: string;
    gameID: string;
    image: string;
    name: string;
    ratings: number[];
    tags: string[];
};

function UserQueue() {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [queueNames, setQueueNames] = useState<string[]>([]);
    const [gamesInQueue, setGamesInQueue] = useState<Game[]>([]);
    const [gamesInQueueOriginal, setGamesInQueueOriginal] = useState<Game[]>([]);
    const [userQueues, setUserQueues] = useState<Map<string, string[]>>(new Map());
    const [queueToShow, setQueueToShow] = useState<string>("");
    const [queueFinished, setQueueFinished] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        const fetchGamesInQueue = async () => {
            if (queueToShow && userQueues.has(queueToShow)) {
                try {
                    const gameIDs = userQueues.get(queueToShow) || [];

                    const gamesPromises = gameIDs.map(async (id) => {
                        try {
                            const game = await getGameByID(id);
                            return game;
                        } catch (error) {
                            console.error(`Failed to fetch game ${id}:`, error);
                            return undefined;
                        }
                    });

                    const games = await Promise.all(gamesPromises);

                    //Filter out undefined games
                    const validGames = games.filter(
                        (game) => game !== undefined
                    ) as Game[];
                    setGamesInQueue(validGames);
                    setGamesInQueueOriginal(validGames);
                } catch (error) {
                    console.error("Failed to fetch games in queue:", error);
                    setGamesInQueue([]);
                }
            }
        };

        fetchGamesInQueue();
    }, [queueToShow, userQueues]);

    useEffect(() => {
        const fetchQueues = async () => {
            setIsLoading(true);
            if (currentUser) {
                try {
                    const queuesData = await getUserQueues(currentUser.uid);
                    if (Object.keys(queuesData).length !== 0) {
                        const queuesMap = new Map<string, string[]>(
                            Object.entries(queuesData)
                        );
                        setUserQueues(queuesMap);

                        const queueNames = Array.from(queuesMap.keys());
                        setQueueNames(queueNames);
                    }
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error("Failed to fetch queues:", error);
                }
            }
        };
        fetchQueues();
    }, [currentUser]);

    const handleNextClick = () => {
        setGamesInQueue((gamesInQueue) => gamesInQueue.slice(1));
        if (gamesInQueue.length === 1) {
            setQueueFinished(true);
        }
    };

    const handleRestartClick = () => {
        setQueueFinished(false);
        setGamesInQueue(gamesInQueueOriginal);
    };

    const handleDeleteQueue = async () => {
        if (currentUser && queueToShow) {
            setIsLoading(true); 
            try {
                await deleteQueue(queueToShow, currentUser.uid); 
                const updatedQueues = new Map(userQueues);
                updatedQueues.delete(queueToShow); 
                setQueueNames(queueNames.filter(name => name !== queueToShow));
                setUserQueues(updatedQueues);
                setQueueToShow("");
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete queue:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleOpen = () => {
        setModalOpened(true);
    };

    return (
        <Stack>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Header>
            <Stack align="center" justify="flex-start">
                <h1>Min kø</h1>
            </Stack>

            <Group justify="center">
                <Select
                    w={"33%"}
                    checkIconPosition="right"
                    label="Velg en kø"
                    placeholder="Min kø"
                    data={queueNames.map((name) => ({ value: name, label: name }))}
                    value={queueToShow}
                    onSearchChange={(value) => setQueueToShow(value)}
                    searchable
                ></Select>
            </Group>
            {queueToShow && !queueFinished && (
                <Group justify="center">
                    <Tooltip label="Slett kø">
                        <Button 
                            onClick={handleOpen} 
                            color="#424874"
                            radius="md"
                        >
                            <IconCircleMinus stroke={1} />
                        </Button>
                    </Tooltip>

                    <Tooltip label="Restart kø">
                        <Button
                            color="#424874"
                            radius="md"
                            onClick={handleRestartClick}
                        >
                            <IconRotateClockwise />
                            <Text size="lg">Restart</Text>
                        </Button>
                    </Tooltip>

                    <Tooltip label="Neste spill">
                        <Button
                            color="#424874"
                            radius="md"
                            onClick={handleNextClick}
                        >
                            <IconPlayerPlay />
                            <Text size="lg">Neste</Text>
                        </Button>
                    </Tooltip>

                    <Modal
                        opened={modalOpened}
                        onClose={() => setModalOpened(false)}
                        title="Bekreft sletting av kø"
                    >
                        <Group justify="center">
                            <Text>Er du sikker på at du vil slette køen?</Text>
                        </Group>
                        <Group justify="center">
                            <Button onClick={() => setModalOpened(false)}>Avbryt</Button>
                            <Button onClick={handleDeleteQueue}>Slett</Button>
                        </Group>
                    </Modal>
                </Group>
                )}
                {queueToShow && !queueFinished &&  (
                <Stack>
                    <Grid
                        gutter="xl"
                        justify="center"
                        style={{ maxWidth: "1200px", width: "100%", minHeight: "600px", margin: "0 auto" }}
                    >
                        <Grid.Col span={4}>
                            <div style={{ height: '800px', overflow: 'auto' }}>
                                <Queue games={gamesInQueue} />
                            </div>
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <div style={{ height: '800px', overflow: 'auto' }} >
                                {gamesInQueue.length > 0 && (
                                    <Gamepage
                                        name={gamesInQueue[0].name}
                                        description={gamesInQueue[0].description}
                                        gameID={gamesInQueue[0].gameID}
                                        image={gamesInQueue[0].image}
                                        onLikeClick={() => { }}
                                        displayLike={false}
                                        displayReport={false}
                                        displayAdd={false}
                                    />
                                )}
                                <Timer />
                            </div>
                            
                        </Grid.Col>
                    </Grid>
                </Stack>
            )}

            {!isLoading && queueToShow === "" && userQueues.size !== 0 && (
                <Stack align="center">
                    <Text>Velg en kø for å se innhold</Text>
                </Stack>
            )}

            {!isLoading && userQueues.size === 0 && (
                <NoQueueFound />
            )}

            {queueFinished && (
                <Stack align="center">
                    <Text>Køen er tom. Vil du spille køen igjen?</Text>
                    <Button onClick={handleRestartClick}>Start køen på nytt</Button>
                </Stack>
            )}
            <div style={{ padding: "40px 0" }}></div>
        </Stack>
    );
}

export default UserQueue;
