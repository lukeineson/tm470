// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Login screen.
 * - Responsive: form uses full width with max container width.
 * - Accessibility: inputs & actions labeled with roles/hints.
 * - Keyboard-safe: content scrolls and avoids the keyboard on small screens.
 */
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const maxFormWidth = isTablet ? 520 : 420;

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(`${process.env.API_URL || "http://localhost:5000"}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      await AsyncStorage.setItem("userToken", data.token);
      Alert.alert("Login Successful", "Welcome back!");
      navigation.replace("Home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.form, { maxWidth: maxFormWidth }]}>
          <Text style={styles.title}>TrainHeroPup</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            placeholderTextColor="#00000090"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            accessibilityLabel="Username"
            accessibilityHint="Enter your username"
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#00000090"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            accessibilityLabel="Password"
            accessibilityHint="Enter your password"
            returnKeyType="done"
          />

          {/* Row with login button + register link */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              accessibilityRole="button"
              accessibilityLabel="Login"
              accessibilityHint="Logs you in and navigates to the home screen"
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              accessibilityRole="link"
              accessibilityLabel="Go to registration"
            >
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(4, 42, 255, 0.6)",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 28,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(252, 236, 236, 0.25)",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    alignItems: "center",
  },
  button: {
    backgroundColor: "rgba(4, 42, 255, 1)",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#000", textDecorationLine: "underline", fontSize: 16 },
  error: { marginTop: 16, color: "red", fontWeight: "bold" },
});


