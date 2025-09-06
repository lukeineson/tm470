// import React, { useEffect, useState } from "react";
// import { Text, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// // Screens
// import LoginScreen from "./screens/LoginScreen";
// // later you’ll add RegisterScreen and ModulesScreen
// import RegisterScreen from "./screens/RegisterScreen";
// // import ModulesScreen from "./screens/ModulesScreen";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch(`${process.env.API_URL || "http://localhost:5000"}/health`)
//       .then((res) => res.json())
//       .then((data) => setMessage(data.message))
//       .catch(() => setMessage("API not reachable"));
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Login"
//         screenOptions={{
//           headerShown: false, // hides the default header to match your design
//         }}
//       >
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         {/* <Stack.Screen name="Modules" component={ModulesScreen} /> */}
//       </Stack.Navigator>

//       {/* Keep health check display for debugging */}
//       <View style={{ position: "absolute", bottom: 40, alignSelf: "center" }}>
//         <Text>Backend Status: {message}</Text>
//       </View>
//     </NavigationContainer>
//   );
// }



import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

