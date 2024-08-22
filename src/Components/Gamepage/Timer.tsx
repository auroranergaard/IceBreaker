import { Box, Button, Text } from '@mantine/core';
import { useStopwatch } from 'react-timer-hook';

function Timer() {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <Box m={30} style={{ textAlign: 'center' }}>
      <Text fw={700} size='xl'>Stoppeklokke</Text>
      <Box style={{ fontSize: '50px' }}>
        <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
      </Box>
      {
        isRunning ? <Button variant='filled' color='#424874' radius='md' m={3} onClick={() => pause()}>Stopp</Button> : <Button m={3} variant='filled' color='#424874' radius='md' onClick={() => start()}>Start</Button>
      }
      <Button m={3} variant='filled' color='#424874' radius='md' onClick={() => { reset(undefined, false); }}>Reset</Button>
    </Box>
  );
}

export default Timer;