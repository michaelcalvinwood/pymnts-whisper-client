import { Box, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from 'react'

function InputSpeaker({num, name, updateSpeaker, focus}) {
  const inputRef = useRef();
  
  useEffect(() => {
    if (focus) {
      console.log('is focused', num);
      inputRef.current.focus();
    }
  })
  return (
    <Box display="flex" alignItems={'center'} margin={'.5rem 0'}>
        <Text width='8rem'>Speaker {num}: </Text>
        <Input  ref={inputRef} value={name} onChange={(e) => updateSpeaker(num, e.target.value)} />
    </Box>
  )
}

export default InputSpeaker