import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SavedContact = {
  id: string;
  name: string;
  number: string;
};

const countryCodes = [
  { label: "🇨🇲 Cameroun (+237)", code: "237" },
  { label: "🇫🇷 France (+33)", code: "33" },
  { label: "🇺🇸 USA (+1)", code: "1" },
  { label: "🇬🇧 UK (+44)", code: "44" },
  { label: "🇳🇬 Nigeria (+234)", code: "234" },
];

export default function SavedContactsScreen() {
  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<SavedContact[]>([]);
  const [countryCode, setCountryCode] = useState("237"); // ✅ Par défaut Cameroun
  const [modalVisible, setModalVisible] = useState(true); // ✅ Demande l'indicatif au lancement

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
            id: contact.id ?? `no-id-${index}`,
            name: contact.name || "Inconnu",
            number: contact.phoneNumbers?.[0]?.number || "N/A",
          }));

        setContacts(saved);
        setFilteredContacts(saved);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.number.includes(searchQuery)
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const formatPhoneNumber = (phone: string): string => {
    const cleanedPhone = phone.replace(/\D/g, ""); // Retire tout sauf chiffres
    if (phone.startsWith("+") || phone.startsWith("00")) {
      return cleanedPhone;
    }
    return `${countryCode}${cleanedPhone}`;
  };

  const callNumber = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    Linking.openURL(`tel:${formattedPhone}`).catch(() =>
      Alert.alert("Erreur", "Impossible d'ouvrir le composeur téléphonique.")
    );
  };

  const sendSMS = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    Linking.openURL(`sms:${formattedPhone}`).catch(() =>
      Alert.alert("Erreur", "Impossible d'ouvrir l'application SMS.")
    );
  };

  const sendWhatsApp = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    Linking.openURL(`whatsapp://send?phone=${formattedPhone}`).catch(() =>
      Alert.alert(
        "WhatsApp non installé",
        "Installe WhatsApp pour utiliser cette fonctionnalité."
      )
    );
  };

  const renderItem = ({ item }: { item: SavedContact }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.number}>{item.number}</Text>
      </View>
      <View style={styles.actions}>
        {/* 📞 Call */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => callNumber(item.number)}
        >
          <MaterialCommunityIcons name="phone" size={22} color="#16A34A" />
        </TouchableOpacity>
        {/* 💬 SMS */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => sendSMS(item.number)}
        >
          <MaterialCommunityIcons
            name="message-text"
            size={22}
            color="#3B82F6"
          />
        </TouchableOpacity>
        {/* 🟢 WhatsApp */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => sendWhatsApp(item.number)}
        >
          <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Modal pour choisir l’indicatif pays */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir l’indicatif pays</Text>
            {countryCodes.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={styles.countryButton}
                onPress={() => {
                  setCountryCode(item.code);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.countryText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.title}>📋 Numéros Enregistrés</Text>
      </View>

      {/* 🔥 Champ de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un nom ou numéro..."
        placeholderTextColor="#94A3B8"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
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
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#F1F5F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#0F172A",
  },
  countryButton: {
    paddingVertical: 12,
  },
  countryText: {
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
  },
});
