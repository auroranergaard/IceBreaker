import { useDisclosure } from "@mantine/hooks";
import {
    Modal,
    Button,
    Box,
    Textarea,
    Stack,
} from "@mantine/core";
import {IconAlertOctagon} from "@tabler/icons-react"
import { reportComment } from "../../Utility/DatabaseWriteUtil";

type ReportCommentProps = {
    reportingUid: string;
    gameID: string;
    uid: string;  
};

function ReportComment(props: ReportCommentProps) {
    const [opened, { open, close }] = useDisclosure(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
    
        const form = event.target;
        const melding = form[0].value;
        reportComment(props.uid, props.gameID, props.reportingUid, melding);
        close();
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="Rapporter kommentar">
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
            <Button variant = "transparent" color="red" onClick={open} >
                {<IconAlertOctagon stroke={1}/>}
            </Button>
        </>
    );
}

export default ReportComment;