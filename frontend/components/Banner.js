// components/Banner.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useWindowDimensions,
  Platform,
} from "react-native";

/**
 * App-wide banner/header.
 * - Responsive: typography and paddings adapt to screen width.
 * - Accessibility: all actionable items expose labels/roles/hints.
 */
export default function Banner({ title, navigation, onLogout }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { width } = useWindowDimensions();

  // Simple responsive scale — tweak breakpoints as needed.
  const isPhone = width < 380;
  const isTablet = width >= 768;

  const FONT_TITLE = isTablet ? 30 : isPhone ? 22 : 26;
  const PADDING_H = isTablet ? 28 : isPhone ? 14 : 20;
  const PADDING_V = isTablet ? 18 : isPhone ? 12 : 15;

  return (
    <>
      <View
        style={[
          styles.banner,
          { paddingHorizontal: PADDING_H, paddingVertical: PADDING_V },
        ]}
        accessible
        accessibilityRole="header"
        accessibilityLabel={`${title} header`}
      >
        {/* Burger menu button */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={menuVisible ? "Close menu" : "Open menu"}
          accessibilityHint="Opens navigation options"
          onPress={() => setMenuVisible((v) => !v)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.leftIconBox}
        >
          <Text style={[styles.burger, { fontSize: isTablet ? 30 : 28 }]}>
            {menuVisible ? "✕" : "☰"}
          </Text>
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={[styles.title, { fontSize: FONT_TITLE }]}
          numberOfLines={1}
          accessibilityRole={Platform.OS === "web" ? "heading" : undefined}
        >
          {title}
        </Text>

        {/* Spacer for symmetry */}
        <View style={styles.leftIconBox} />
      </View>

      {/* Menu Overlay */}
      <Modal
        animationType="fade"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        presentationStyle="overFullScreen"
      >
        <View style={styles.overlay} accessible accessibilityLabel="Menu overlay">
          <View
            style={[
              styles.menu,
              { paddingTop: isTablet ? 70 : 60, paddingHorizontal: PADDING_H },
            ]}
            accessibilityViewIsModal
            accessibilityLabel="Navigation menu"
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={() => setMenuVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.menuItem}>✖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go to Home"
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Home");
              }}
              style={styles.menuTap}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go to Profile"
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Profile");
              }}
              style={styles.menuTap}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Log out"
              accessibilityHint="Logs you out and returns to the login screen"
              onPress={() => {
                setMenuVisible(false);
                onLogout?.();
              }}
              style={styles.menuTap}
            >
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#00000040",
    backgroundColor: "rgba(4, 42, 255, 0.6)",
  },
  leftIconBox: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  burger: {
    color: "#fff",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  menu: {
    backgroundColor: "rgba(4, 42, 255, 1)",
    paddingBottom: 24,
  },
  menuTap: {
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  menuItem: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 16,
    fontWeight: "bold",
  },
});
