import { Box, Input, Text } from '@chakra-ui/react'
import React from 'react'

function InputSpeaker({num, name, updateSpeaker}) {
    console.log('InputSpeaker', num, name, updateSpeaker);
  return (
    <Box display="flex" alignItems={'center'} margin={'.5rem 0'}>
        <Text width='8rem'>Speaker {num}: </Text>
        <Input value={name} onChange={(e) => updateSpeaker(num, e.target.value)} />
    </Box>
  )
}

export default InputSpeaker