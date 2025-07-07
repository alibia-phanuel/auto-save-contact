import fetchAndSyncContacts from "@/api/fakeAPI";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function App() {
  useEffect(() => {
    // 🔥 Appel initial
    fetchAndSyncContacts();
    // 🔁 Appel périodique toutes les 30 secondes
    const interval = setInterval(fetchAndSyncContacts, 30000);

    return () => clearInterval(interval); // Clean up
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto-Save Contacts 📲</Text>
      <Text>Les numéros WhatsApp sont enregistrés automatiquement.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
