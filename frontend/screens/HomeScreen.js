import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../components/Banner";

export default function HomeScreen({ navigation }) {
  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const res = await fetch("http://localhost:5000/modules", {
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
  useFocusEffect(useCallback(() => {
    fetchModules();
  }, []));

  const toggleCompletion = async (moduleId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const res = await fetch(`http://localhost:5000/progress/${moduleId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

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
      style={styles.moduleRow}
      onPress={() => navigation.navigate("TrainingCard", { moduleId: item._id })}
    >
      <Text style={[styles.moduleCell, { flex: 2 }]}>{item.title}</Text>
      <Text style={[styles.moduleCell, { flex: 2 }]}>{item.category}</Text>
      <Text style={[styles.moduleCell, { flex: 1 }]}>{item.difficulty}</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => toggleCompletion(item._id)}
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
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderModule}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(4, 42, 255, 0.6)" },
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(252, 236, 236, 0.25)",
    width: "80%",
    alignSelf: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  moduleCell: { color: "#fff", fontSize: 16, fontWeight: "500" },
  toggleButton: { width: 28, height: 28, justifyContent: "center", alignItems: "center" },
  tick: { color: "green", fontSize: 20 },
  emptyCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#000" },
});

