import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import AppButton from "@/components/AppButton";
import ImagePicker from "@/utils/ImagePicker";
import { fetchFoodData } from "@/service/Usda";
import { useFoodDatabase } from "@/utils/FoodDatabase";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { insertFoodItem } = useFoodDatabase();

  const handleSearch = () => {
    try {
      if (searchQuery.trim() === "") {
        throw new Error("Search query cannot be empty");
      }
      fetchFoodData(searchQuery);
      console.log("Searching for:", searchQuery);
      // Empty the search input after searching
      setSearchQuery("");
    } catch (error) {
      console.error("Error:", (error as Error)?.message);
    }
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
          <AppButton
            label="Search"
            style={styles.searchButton}
            onPress={handleSearch}
          />
        </View>

        <AppButton
          label="Scan Food"
          onPress={() => router.navigate("/camera")}
          style={styles.fullWidthButton}
        />
        <AppButton
          label="Add An Image"
          onPress={() => {
            // call the async function safely
            ImagePicker(insertFoodItem);
          }}
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
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
