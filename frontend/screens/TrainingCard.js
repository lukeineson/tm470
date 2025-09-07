// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   SafeAreaView,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useFocusEffect } from "@react-navigation/native";
// import Banner from "../components/Banner"; // ← use the shared Banner

// export default function TrainingCard({ route, navigation }) {
//   const { moduleId } = route.params;
//   const [module, setModule] = useState(null);
//   const [completed, setCompleted] = useState(false);

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("userToken");
//     navigation.replace("Login");
//   };

//   const fetchModule = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (!token) {
//         navigation.replace("Login");
//         return;
//       }

//       // module details
//       const res = await fetch(
//         `${process.env.API_URL || "http://localhost:5000"}/module/${moduleId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!res.ok) throw new Error("Unable to fetch training module");
//       const data = await res.json();

//       // fetch modules to get current completion status
//       const statusRes = await fetch(`${process.env.API_URL || "http://localhost:5000"}/modules`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!statusRes.ok) throw new Error("Unable to fetch module status");
//       const allModules = await statusRes.json();
//       const currentModule = allModules.find((m) => m._id === moduleId);

//       setModule(data);
//       setCompleted(currentModule?.completed || false);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Unable to load training module.");
//     }
//   };

//   // refetch whenever screen is focused
//   useFocusEffect(
//     useCallback(() => {
//       fetchModule();
//     }, [moduleId])
//   );

//   const toggleCompletion = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (!token) return;

//       const res = await fetch(
//         `${process.env.API_URL || "http://localhost:5000"}/progress/${moduleId}`,
//         { method: "POST", headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!res.ok) throw new Error("Unable to update completion");

//       // after toggling, refresh the module status from backend
//       await fetchModule();
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Unable to update completion status.");
//     }
//   };

//   if (!module) {
//     return (
//       <SafeAreaView style={styles.container}>
//         {/* Use Banner component so burger menu appears the same as HomeScreen */}
//         <Banner title="Loading..." navigation={navigation} onLogout={handleLogout} />
//         <View style={styles.card}>
//           <Text style={{ color: "#fff" }}>Loading training...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Banner with interactive menu (same as HomeScreen) */}
//       <Banner title="TrainHeroPup" navigation={navigation} onLogout={handleLogout} />

//       <View style={styles.card}>
//         {/* Completion tick top-left */}
//         <TouchableOpacity style={styles.tickContainer} onPress={toggleCompletion}>
//           {completed ? (
//             <Ionicons name="checkmark-circle" size={28} color="#00FF00" />
//           ) : (
//             <Ionicons name="ellipse-outline" size={28} color="#000000" />
//           )}
//         </TouchableOpacity>

//         {/* Back button top-right */}
//         <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.title}>{module.title}</Text>

//         <Image
//           source={{ uri: `http://localhost:5000${module.imagePath}` }}
//           style={styles.image}
//           resizeMode="contain"
//         />

//         <ScrollView style={styles.steps} contentContainerStyle={{ paddingBottom: 50 }}>
//           {module.trainingSteps.map((step, idx) => (
//             <Text key={idx} style={styles.step}>
//               • {step}
//             </Text>
//           ))}
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// // Styles
// const { width, height } = Dimensions.get("window");
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "rgba(4, 42, 255, 0.6)", alignItems: "center" },
//   fullWidthBanner: { width: "100%", backgroundColor: "rgba(0,0,0,0.3)", paddingVertical: 15, alignItems: "center" },
//   bannerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold" },
//   card: { width: width * 0.9, backgroundColor: "rgba(252, 236, 236, 0.25)", borderRadius: 12, padding: 20, marginBottom: 20, position: "relative" },
//   tickContainer: { position: "absolute", top: 15, left: 15, zIndex: 10 },
//   backContainer: { position: "absolute", top: 15, right: 15, flexDirection: "row", alignItems: "center", zIndex: 10 },
//   backText: { color: "#FFFFFF", fontSize: 16, marginLeft: 5 },
//   title: { fontSize: 24, fontWeight: "bold", color: "rgba(255,255,255,0.7)", marginBottom: 15, textAlign: "center", marginTop: 10 },
//   image: { width: "100%", height: height * 0.25, marginBottom: 20, borderRadius: 8 },
//   steps: { flexGrow: 0 },
//   step: { fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 10 },
// });

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../components/Banner"; // shared Banner

export default function TrainingCard({ route, navigation }) {
  const { moduleId } = route.params;
  const [module, setModule] = useState(null);
  const [completed, setCompleted] = useState(false);

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

      // refresh module status from backend
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
        <View style={styles.card}>
          <Text style={{ color: "#fff" }}>Loading training...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Banner title="TrainHeroPup" navigation={navigation} onLogout={handleLogout} />

      <View style={styles.card}>
        {/* Completion tick top-left */}
        <TouchableOpacity style={styles.tickContainer} onPress={toggleCompletion}>
          {completed ? (
            <Ionicons name="checkmark-circle" size={28} color="#00FF00" />
          ) : (
            <Ionicons name="ellipse-outline" size={28} color="#000000" />
          )}
        </TouchableOpacity>

        {/* Back button top-right */}
        <TouchableOpacity style={styles.backContainer} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{module.title}</Text>

        <Image
          source={{ uri: `http://localhost:5000${module.imagePath}` }}
          style={styles.image}
          resizeMode="contain"
        />

        <ScrollView style={styles.steps} contentContainerStyle={{ paddingBottom: 50 }}>
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

// Styles
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "rgba(4, 42, 255, 0.6)", alignItems: "center" },
  card: {
    width: width * 0.9,
    backgroundColor: "rgba(252, 236, 236, 0.25)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    position: "relative",
  },
  tickContainer: { position: "absolute", top: 15, left: 15, zIndex: 10 },
  backContainer: { position: "absolute", top: 15, right: 15, flexDirection: "row", alignItems: "center", zIndex: 10 },
  backText: { color: "#FFFFFF", fontSize: 16, marginLeft: 5 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 15,
    textAlign: "center",
    marginTop: 10,
  },
  image: { width: "100%", height: height * 0.25, marginBottom: 20, borderRadius: 8 },
  steps: {
    flexGrow: 0,
  },
  stepsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 15,
    textAlign: "center",
  },
  step: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
    textAlign: "center",
  },
});
