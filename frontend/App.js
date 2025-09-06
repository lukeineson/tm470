import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import TrainingCard from "./screens/TrainingCard";

const Stack = createNativeStackNavigator();

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.API_URL || "http://localhost:5000"}/health`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("API not reachable"));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // hides the default header to match your design
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TrainingCard" component={TrainingCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

