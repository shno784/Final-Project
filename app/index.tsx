import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ImagePicker from "@/utils/ImagePicker";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Perform search logic here
    console.log("Searching for:", searchQuery);
    // router.navigate("/search", { query: searchQuery });
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>My Nutrition App</Text>
          <Text style={styles.subtitle}>Scan, Search, and Compare Foods</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Food"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        <AppButton
          label="Scan Food"
          onPress={() => router.navigate("/camera")}
          style={styles.fullWidthButton}
        />
        <AppButton
          label="Add An Image"
          onPress={ImagePicker}
          style={styles.fullWidthButton}
        />

        {/* Row for Food Results and Options/Settings */}
        <View style={styles.row}>
          <AppButton
            label="View Food History"
            onPress={() => router.navigate("/History")}
            style={styles.halfButton}
            variant="primary"
          />
          <AppButton
            label="Settings"
            onPress={() => router.navigate("/options")}
            style={styles.halfButton}
            variant="secondary"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "flex-start", // start at the top
  },
  headerContainer: {
    marginTop: 150, // push header down from the very top
    alignItems: "center",
    marginBottom: 80, // push subsequent content further down
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  fullWidthButton: {
    width: "100%",
    backgroundColor: "#1abc9c",
    marginBottom: 20,
  },
  searchContainer: {
    width: "100%",
    marginBottom: 50,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  halfButton: {
    flex: 1,
  },
});
