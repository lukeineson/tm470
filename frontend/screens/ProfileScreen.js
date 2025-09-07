// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Banner from "../components/Banner";

/**
 * Profile screen with progress summary.
 * - Responsive: card width caps; typography scales with width.
 * - Accessibility: progress bars expose accessibilityValue (min/max/now).
 */
export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const cardMaxWidth = isTablet ? 720 : 560;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.replace("Login");
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const res = await fetch(`${process.env.API_URL || "http://localhost:5000"}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to load profile data.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Banner title="Profile" navigation={navigation} onLogout={handleLogout} />
        <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Banner title="TrainHeroPup" navigation={navigation} onLogout={handleLogout} />

      <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* User Info */}
          <Text style={styles.text}>Username: {profile.username}</Text>
          <Text style={styles.text}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.text}>Puppy Name: {profile.puppyName}</Text>

          {/* Progress Section */}
          <Text style={[styles.text, styles.section]}>Progress:</Text>
          <Text style={styles.text}>
            Total Number of Completed Modules: {profile.totalComplete}
          </Text>

          <Text style={[styles.text, styles.section]}>Percentage Completed:</Text>
          {Object.entries(profile.categoryProgress).map(([category, percent]) => (
            <View key={category} style={{ marginBottom: 14 }}>
              <View style={styles.progressRow} accessible>
                <Text style={styles.text}>{category}</Text>
                <Text style={styles.text}>{percent}%</Text>
              </View>
              <View
                style={styles.progressBarBackground}
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel={`${category} progress`}
                accessibilityValue={{ min: 0, max: 100, now: percent }}
              >
                <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(4, 42, 255, 0.6)",
    alignItems: "center",
  },
  card: {
    width: "92%",
    backgroundColor: "rgba(252, 236, 236, 0.25)",
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  text: { fontSize: 16, color: "#fff" },
  section: {
    marginTop: 18,
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#ffffff40",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#04d9ff" },
  loadingText: { fontSize: 16, color: "#fff", textAlign: "center" },
});

