// screens/TrainingCard.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../components/Banner";

/**
 * Training detail card.
 * - Responsive: image height & paddings scale; card width caps.
 * - Accessibility: toggle/back buttons labeled; steps are readable.
 */
export default function TrainingCard({ route, navigation }) {
  const { moduleId } = route.params;
  const [module, setModule] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const cardMaxWidth = isTablet ? 720 : 560;
  const imageHeight = Math.max(160, Math.min(280, Math.round(width * 0.45)));

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("Login");
  };

  const fetchModule = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      // fetch module details
      const res = await fetch(
        `${process.env.API_URL || "http://localhost:5000"}/module/${moduleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Unable to fetch training module");
      const data = await res.json();

      // fetch modules to get current completion status
      const statusRes = await fetch(
        `${process.env.API_URL || "http://localhost:5000"}/modules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!statusRes.ok) throw new Error("Unable to fetch module status");
      const allModules = await statusRes.json();
      const currentModule = allModules.find((m) => m._id === moduleId);

      setModule(data);
      setCompleted(currentModule?.completed || false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to load training module.");
    }
  };

  // refetch whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchModule();
    }, [moduleId])
  );

  const toggleCompletion = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(
        `${process.env.API_URL || "http://localhost:5000"}/progress/${moduleId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Unable to update completion");

      await fetchModule();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to update completion status.");
    }
  };

  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <Banner title="Loading..." navigation={navigation} onLogout={handleLogout} />
        <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
          <Text style={{ color: "#fff" }}>Loading training...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Banner title="TrainHeroPup" navigation={navigation} onLogout={handleLogout} />

      <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
        {/* Completion toggle */}
        <TouchableOpacity
          style={styles.tickContainer}
          onPress={toggleCompletion}
          accessibilityRole="switch"
          accessibilityLabel={completed ? "Mark as not completed" : "Mark as completed"}
          accessibilityState={{ checked: completed }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {completed ? (
            <Ionicons name="checkmark-circle" size={28} color="#00FF00" />
          ) : (
            <Ionicons name="ellipse-outline" size={28} color="#000000" />
          )}
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{module.title}</Text>

        <Image
          source={{ uri: `http://localhost:5000${module.imagePath}` }}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessible
          accessibilityLabel={`${module.title} image`}
        />

        <ScrollView
          style={styles.steps}
          contentContainerStyle={{ paddingBottom: 24 }}
          accessibilityLabel="Training steps"
        >
          <Text style={styles.stepsHeader}>Training Steps:</Text>
          {module.trainingSteps.map((step, idx) => (
            <Text key={idx} style={styles.step}>
              {idx + 1}. {step}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(4, 42, 255, 0.6)", alignItems: "center" },
  card: {
    width: "92%",
    backgroundColor: "rgba(252, 236, 236, 0.25)",
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    position: "relative",
  },
  tickContainer: { position: "absolute", top: 14, left: 14, zIndex: 10 },
  backContainer: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    gap: 6,
  },
  backText: { color: "#FFFFFF", fontSize: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
    textAlign: "center",
    marginTop: 6,
  },
  image: { width: "100%", borderRadius: 8, marginBottom: 16 },
  steps: { flexGrow: 0 },
  stepsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.95)",
    marginBottom: 12,
    textAlign: "center",
  },
  step: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 10,
    textAlign: "center",
  },
});
