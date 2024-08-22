import {
    Text,
    Box,
    ScrollArea,
    Stack,
} from "@mantine/core";

const NoQueueFound = () => {
    return (
        <Box
            style={{
                maxWidth: 400,
                height: "100%",
                margin: "auto",
            }}
        >
            <ScrollArea style={{ height: "100%", width: "100%" }} scrollbarSize={8}>
                <div style={{ padding: "20px 0" }}>
                    <Stack justify="center" align="center" style={{ padding: "20px 0" }}>
                        <Text>Du har ingen køer!</Text>
                        <Text>Legg en lek til i en kø for å komme i gang</Text>
                    </Stack>
                </div>
            </ScrollArea>
        </Box>
    );
};

export default NoQueueFound;