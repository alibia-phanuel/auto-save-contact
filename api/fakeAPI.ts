import * as Contacts from "expo-contacts";

export const mockData = [
  { name: "Inconnu 1", numero: "+237650000001" },
  { name: "Inconnu 2", numero: "+237650000002" },
  { name: "Inconnu 3", numero: "+237650000003" },
];

export async function saveContactIfNotExists(
  name: string,
  phoneNumber: string
) {
  // 📱 Demander permission
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("⛔ Permission refusée pour accéder aux contacts.");
    return;
  }

  // 🔍 Vérifier si le numéro existe déjà
  const existingContacts = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const alreadyExists = existingContacts.data.some((contact) =>
    contact.phoneNumbers?.some(
      (phone) =>
        phone.number?.replace(/\s+/g, "") === phoneNumber.replace(/\s+/g, "")
    )
  );

  if (alreadyExists) {
    console.log(`⚠️ ${phoneNumber} déjà présent dans les contacts.`);
    return;
  }

  // ✅ Enregistrer le nouveau contact
  const newContact: Contacts.Contact = {
    id: "",
    contactType: Contacts.ContactTypes.Person,
    name,
    [Contacts.Fields.FirstName]: name,
    [Contacts.Fields.PhoneNumbers]: [
      {
        label: "mobile",
        number: phoneNumber,
        isPrimary: true,
      },
    ],
  };

  try {
    await Contacts.addContactAsync(newContact);
    console.log(`✅ Contact ajouté : ${name} (${phoneNumber})`);
  } catch (error) {
    console.error(`❌ Erreur ajout ${name} :`, error);
  }
}

export default async function fetchAndSyncContacts() {
  console.log("📥 Mock API appelée - Synchronisation en cours...");
  for (const item of mockData) {
    await saveContactIfNotExists(item.name, item.numero);
  }
  console.log("✅ Synchronisation terminée !");
}
