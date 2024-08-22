import { useDisclosure } from "@mantine/hooks";
import {
    Modal,
    Button,
    Box,
    Group,
    TextInput,
    Stack,
    Select
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "../../AuthContext/index.js";
import { createNewGame } from "../../Utility/DatabaseWriteUtil.js";

function NyLek() {
    const [opened, { open, close }] = useDisclosure(false);
    const { userLoggedIn } = useAuth();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
    
        const form = event.target;
        const name = form[0].value;
        const description = form[1].value;
        const image = form[2].value;
        const category = form[3].value;
    
        createNewGame(category, description, image, name);
        close();
    };

    if (!userLoggedIn) {
        return null;
    }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Opprett ny lek">
                {
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Stack>
                                <TextInput
                                    label="Navn"
                                    withAsterisk
                                    required
                                    placeholder="Navn"
                                ></TextInput>
                                <TextInput
                                    label="Beskrivelse"
                                    withAsterisk
                                    required
                                    placeholder="Beskrivelse"
                                ></TextInput>
                                <TextInput
                                    label="Bildelink"
                                    withAsterisk
                                    required
                                    placeholder="Link"
                                ></TextInput>
                                <Select
                                    data={['Barnevennlig', 'Drikkelek', 'Utendørs']}
                                    placeholder="Kategori"
                                    label="Velg en kategori"
                                />
                                <Button
                                    type="submit"
                                    color="#424874"
                                    style={{ width: "150px" }}
                                >
                                    Ferdig
                                </Button>
                            </Stack>
                        </Box>
                    </form>
                }
            </Modal>

            <Button onClick={open} w={"66%"} color="#424874">
                <Group>{<IconPlus />} Opprett ny Icebreaker</Group>
            </Button>
        </>
    );
}

export default NyLek;
