import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save JWT token to AsyncStorage
      await AsyncStorage.setItem("userToken", data.token);

      Alert.alert("Login Successful", "Welcome back!");

      // Navigate to Modules/Home screen
      navigation.replace("Home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrainHeroPup</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        placeholderTextColor="#000"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#000"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Row with login button + register link */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(4, 42, 255, 0.6)", // 042AFF @ 60%
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "20%",
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  input: {
    width: "60%",
    backgroundColor: "rgba(252, 236, 236, 0.25)", // FCECEC @ 25%
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%", // align with input width
    marginTop: 20,
    alignItems: "center"
  },
  button: {
    width: "48%",
    backgroundColor: "rgba(4, 42, 255, 1)", // 042AFF 100%
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    color: "#000",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  error: {
    marginTop: 20,
    color: "red",
    fontWeight: "bold",
  },
});
