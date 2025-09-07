// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";

/**
 * Registration screen.
 * - Responsive: full-width inputs with max width; scrollable when keyboard opens.
 * - Accessibility: labeled inputs + hints.
 */
export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [puppyName, setPuppyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const maxFormWidth = isTablet ? 560 : 440;

  const handleRegister = async () => {
    setError("");
    try {
      const response = await fetch(`${process.env.API_URL || "http://localhost:5000"}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, puppyName, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      Alert.alert("Success", "User registered successfully!");
      navigation.replace("Login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.form, { maxWidth: maxFormWidth }]}>
          <Text style={styles.title}>TrainHeroPup</Text>

          {[
            { label: "First Name", value: firstName, set: setFirstName, autoCapitalize: "words" },
            { label: "Last Name", value: lastName, set: setLastName, autoCapitalize: "words" },
            { label: "Puppy Name", value: puppyName, set: setPuppyName, autoCapitalize: "words" },
            { label: "Username", value: username, set: setUsername, autoCapitalize: "none" },
          ].map((f) => (
            <View key={f.label} style={{ width: "100%" }}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${f.label}`}
                placeholderTextColor="#00000090"
                value={f.value}
                onChangeText={f.set}
                autoCapitalize={f.autoCapitalize}
                autoCorrect={false}
                accessibilityLabel={f.label}
              />
            </View>
          ))}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#00000090"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            textContentType="newPassword"
            accessibilityLabel="Password"
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              accessibilityRole="button"
              accessibilityLabel="Register"
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              accessibilityRole="link"
              accessibilityLabel="Back to Login"
            >
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(4, 42, 255, 0.6)" },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  form: { width: "100%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 28 },
  label: { alignSelf: "flex-start", fontSize: 16, fontWeight: "500", color: "#fff" },
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

