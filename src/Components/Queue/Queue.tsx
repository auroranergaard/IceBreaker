import {
    Text,
    Box,
    Group,
    ScrollArea,
    Stack,
} from "@mantine/core";

import Lek from "../Leker/Lek";

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

function Queue({ games }: { games: Game[] }) {
    return (
        <Box
            style={{
                maxWidth: 400,
                height: "100%",
                margin: "auto",
                overflow: "hidden",
                borderRadius: "8px",
                border: "3px solid #424874",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <ScrollArea style={{ height: "100%", width: "100%" }} scrollbarSize={8}>
                <div style={{ padding: "20px 0" }}>
                    <Stack justify="center" align="center" style={{ padding: "20px 0" }}>
                        {games.map((game, index) => (
                            <Group style={{ width: "80%" }}>
                                <Text>{index + 1}</Text>
                                <Lek
                                    key={game.gameID}
                                    name={game.name}
                                    category={game.category}
                                    description={game.description}
                                    gameID={game.gameID}
                                    style={{ width: "90%", border: index === 0 ? "2px solid #4287f5" : "none" }}
                                />
                            </Group>
                        ))}
                    </Stack>
                </div>
            </ScrollArea>
        </Box>
    );
}

export default Queue;
