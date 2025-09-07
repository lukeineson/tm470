// screens/HomeScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../components/Banner";

/**
 * Home list of training modules.
 * - Responsive: rows stack vertically on narrow screens, row paddings/size scale.
 * - Accessibility: rows & toggles labeled; list has role & hints.
 */
export default function HomeScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const { width } = useWindowDimensions();
  const isNarrow = width < 380;
  const isTablet = width >= 768;

  const fetchModules = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const res = await fetch(`${process.env.API_URL || "http://localhost:5000"}/modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unable to fetch modules");

      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error("Error fetching modules:", err);
      Alert.alert("Error", "Unable to fetch training modules.");
    }
  };

  // Fetch modules every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchModules();
    }, [])
  );

  const toggleCompletion = async (moduleId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(
        `${process.env.API_URL || "http://localhost:5000"}/progress/${moduleId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        Alert.alert("Error", "Unable to update module completion.");
        return;
      }

      fetchModules(); // Refresh modules from backend
    } catch (err) {
      console.error("Toggle completion error:", err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("Login");
  };

  const renderModule = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.moduleRow,
        {
          padding: isTablet ? 18 : 14,
          width: isTablet ? "70%" : "92%",
          flexDirection: isNarrow ? "column" : "row",
          alignItems: isNarrow ? "flex-start" : "center",
          justifyContent: isNarrow ? "flex-start" : "space-between",
        },
      ]}
      onPress={() => navigation.navigate("TrainingCard", { moduleId: item._id })}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.category}, ${item.difficulty}`}
      accessibilityHint="Opens the training details"
    >
      <Text
        style={[
          styles.moduleCell,
          styles.titleCell,
          !isNarrow && { flex: 2 },
          isNarrow && { marginBottom: 4 },
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.moduleCell,
          !isNarrow && { flex: 1, textAlign: "center" },
          isNarrow && { marginBottom: 4 },
        ]}
      >
        {item.category}
      </Text>
      <Text
        style={[
          styles.moduleCell,
          !isNarrow && { flex: 1, textAlign: "center" },
          isNarrow && { marginBottom: 4 },
        ]}
      >
        {item.difficulty}
      </Text>

      <TouchableOpacity
        style={[styles.toggleButton, isNarrow && { marginTop: 6 }]}
        onPress={() => toggleCompletion(item._id)}
        accessibilityRole="switch"
        accessibilityLabel={`Mark ${item.title} as ${
          item.completed ? "not completed" : "completed"
        }`}
        accessibilityState={{ checked: item.completed }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {item.completed ? <Text style={styles.tick}>✔</Text> : <View style={styles.emptyCircle} />}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Banner title="TrainHeroPup" navigation={navigation} onLogout={handleLogout} />
      <FlatList
        data={modules}
        keyExtractor={(item) => String(item._id)}
        renderItem={renderModule}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Training modules list"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(4, 42, 255, 0.6)" },
  moduleRow: {
    backgroundColor: "rgba(252, 236, 236, 0.25)",
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 12,
    gap: 6,
  },
  moduleCell: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  titleCell: {
    flexShrink: 1,
  },
  toggleButton: {
    marginLeft: "auto",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  tick: { color: "limegreen", fontSize: 22, fontWeight: "bold" },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "transparent",
  },
});
