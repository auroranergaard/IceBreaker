import {
  Text,
  Avatar,
  Group,
  Paper,
  Rating,
  Box,
  Stack,
  Button,
  Tooltip,
} from "@mantine/core";
import { IconCircleMinus } from "@tabler/icons-react";
import { useAuth } from "../../AuthContext";
import { deleteComment } from "../../Utility/DatabaseDeleteUtil";
import NewComment from "./NewComment";
import ReportComment from "./ReportComment";

type CommentProps = {
  username: string;
  profilePicture: string;
  comment: string;
  rating: number;
  gameID: string;
  uid: string;
};

const Comment = (props: CommentProps) => {
  const { currentUser } = useAuth();
  const userID = currentUser?.uid;
  console.log(`Comment: ${props.comment}`);
  console.log(`userID !== props.uid && currentUser: ${userID !== props.uid && currentUser !== null}`);

  const handleDeleteComment = () => {
    if (userID === props.uid) {
      deleteComment(userID, props.gameID);
    }
  };

  return (
    <Paper
      radius="xl"
      withBorder
      p="xs"
      style={{ width: "70%", height: "auto" }}
    >
      <Group
        justify="space-between"
        align="center"
        grow
        preventGrowOverflow={false}
      >
        <Box
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            src={props.profilePicture}
            radius="xl"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
        <Stack p="xs" style={{ flex: 6 }}>
          <Group>
            <Text fz="sm">{props.username}</Text>
            <Rating
              defaultValue={0}
              value={props.rating}
              readOnly
              color="#a6b1e1"
            ></Rating>
          </Group>
          <Text>{props.comment}</Text>
        </Stack>
        <Stack gap="xs">
          {userID === props.uid && (
            <>
              <Tooltip label="Slett kommentar" withArrow>
                <Button
                  variant="transparent"
                  c={"#a6b1e1"}
                  onClick={handleDeleteComment}
                >
                  <IconCircleMinus stroke={1} />
                </Button>
              </Tooltip>
              <NewComment
                Edit={true}
                gameID={props.gameID}
                rating={props.rating}
                comment={props.comment}
              ></NewComment>
            </>
          )}
          {userID !== props.uid && currentUser !== null && (
            <ReportComment
              reportingUid={currentUser.uid}
              gameID={props.gameID}
              uid={props.uid}
            ></ReportComment>
          )}
        </Stack>
      </Group>
    </Paper>
  );
};

export default Comment;
