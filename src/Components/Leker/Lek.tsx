import { Card, Image, Text, Badge, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';


type gameProps = {
  name: string;
  category: string;
  description: string;
  gameID: string;
  image?: string;
  style?: React.CSSProperties;
};

const Lek = (props: gameProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${props.gameID}`);
  };

  /**
   * Shorten the description of the game such that it fits better in the card
   * @param description the description to shorten
   * @param maxLength the maximum length of the description
   * @returns the shortened description
   */
  const shortenDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <Card 
      style={props.style}
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      onClick={handleClick}
    >
      <Card.Section>
        {props.image && (
          <Image
            src={props.image}
            height={160}
            alt="Norway"
          />
        )}
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{props.name}</Text>
        <Badge color="pink">{props.category}</Badge>
      </Group>
      <Text size="sm" color="dimmed">
        {shortenDescription(props.description, 40)}
      </Text>

    </Card>
  );
}

export default Lek;
