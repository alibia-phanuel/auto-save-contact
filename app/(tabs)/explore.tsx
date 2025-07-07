import * as Contacts from "expo-contacts";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type SavedContact = {
  id: string;
  name: string;
  number: string;
};

export default function SavedContactsScreen() {
  const [contacts, setContacts] = useState<SavedContact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        const saved: SavedContact[] = data
          .filter((contact) => contact.phoneNumbers?.length)
          .map((contact, index) => ({
            id: contact.id ?? `no-id-${index}`, // ✅ fallback si id undefined
            name: contact.name || "Inconnu",
            number: contact.phoneNumbers?.[0]?.number || "N/A",
          }));

        setContacts(saved);
      }
    };

    fetchContacts();
  }, []);

  const renderItem = ({ item }: { item: SavedContact }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.number}>{item.number}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Numéros Enregistrés</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id} // ✅ fallback déjà géré
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0F172A",
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  number: {
    fontSize: 14,
    color: "#64748B",
  },
});
