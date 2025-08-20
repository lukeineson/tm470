import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.API_URL || 'http://localhost:5000'}/health`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("API not reachable"));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Puppy Trainer Frontend</Text>
      <Text>{message}</Text>
    </View>
  );
}
