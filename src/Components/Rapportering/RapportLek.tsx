import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Box,
  Group,
  Textarea,
  Stack,
  Tooltip
} from "@mantine/core";
import { IconAlertOctagon } from "@tabler/icons-react"
import { createNewReport } from "../../Utility/DatabaseWriteUtil"

type rapportProps = {
  gameId: string;
}

const RapporterLek = (props: rapportProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const form = event.target;
    const melding = form[0].value;
    createNewReport(melding, props.gameId)
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Rapporter IceBreaker">
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
      <Tooltip
        label="Rapporter icebreaker"
        withArrow
        >
          <Button onClick={open} color="red">
            <Group> {<IconAlertOctagon />}</Group>
          </Button>
      </Tooltip>
    </>
  );
}

export default RapporterLek;
