// app/index.tsx
import { View, Text, StyleSheet, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Scanner App</Text>
      <Link href="./camera" style={styles.linkButton}>
        <Text style={styles.linkText}>Scan Food</Text>
      </Link>
      <Link href="./upload" style={styles.linkButton}>
        <Text style={styles.linkText}>Upload Image</Text>
      </Link>
      <Link href="./History" style={styles.linkButton}>
        <Text style={styles.linkText}>View History</Text>
      </Link>
      <Link href="./options" style={styles.linkButton}>
        <Text style={styles.linkText}>Options</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  linkButton: {
    marginVertical: 10,
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
  },
  linkText: { color: "#fff", fontSize: 16 },
});
