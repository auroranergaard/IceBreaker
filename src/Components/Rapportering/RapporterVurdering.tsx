import { useDisclosure } from "@mantine/hooks";
import {
    Modal,
    Button,
    Box,
    Group,
    Textarea,
    Stack,
} from "@mantine/core";
import {IconAlertOctagon} from "@tabler/icons-react"

function RapporterVurdering() {
    const [opened, { open, close }] = useDisclosure(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
    
        const form = event.target;
        const melding = form[0].value;
        console.log(melding)
        // //legg til databasefunksjon til denne
        close();
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="Rapporter vurdering">
                {
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Stack>
                                <Textarea
                                    label="Hva er galt?"
                                    withAsterisk
                                    required
                                    placeholder="Skriv inn her..."
                                ></Textarea>
                                
                                <Button
                                    type="submit"
                                    color="#424874"
                                    style={{ width: "150px" }}>
                                    Send inn rapport
                                </Button>
                            </Stack>
                        </Box>
                    </form>
                }
            </Modal>

            <Button variant = "transparent" onClick={open} w={"10%"}   color="red" >
                <Group> {<IconAlertOctagon />} </Group>
            </Button>
        </>
    );
}

export default RapporterVurdering;
