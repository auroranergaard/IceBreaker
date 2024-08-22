//IceBreaker/src/Components/spin_the_wheel/spin_the_wheel.tsx
import { Group, Text, Button, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { useNavigate } from 'react-router-dom';
import Lek from '../Leker/Lek';

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


type WheelProps = {
    gamesForWheel: Game[];
};



const SpinTheWheel = ({ gamesForWheel }: WheelProps) => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [modalOpened, setModalOpened] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/game/${gamesForWheel[prizeNumber].gameID}`);
    };

    const data = gamesForWheel.map(game => ({
        option: game.name,
        clickOption: game.gameID
    }));


    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * gamesForWheel.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }

    return (
        <Group justify='center'>
            {modalOpened && (
                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    title="Gå til spill?"
                >
                    <Stack align="center">
                        <Text>Vil du sjekke {gamesForWheel[prizeNumber].name}?</Text>
                    </Stack>
                    <div style={{ padding: "10px 0" }}></div>
                    <Group justify="center">
                        <Button onClick={() => setModalOpened(false)}>Tilbake</Button>
                        <Button onClick={handleNavigate}>Sjekk ut spill</Button>
                    </Group>
                </Modal>
            )}
            {gamesForWheel.length > 1 ? (
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}

                    onStopSpinning={() => {
                        setMustSpin(false);
                        setModalOpened(true);
                    }}
                />
            ) : (<Text>Legg til flere spill for å spinne hjulet! </Text>)}
            {gamesForWheel.length > 1 && (
                <Button onClick={handleSpinClick}>SPIN</Button>
            )}
        </Group>
    )
}

export default SpinTheWheel;