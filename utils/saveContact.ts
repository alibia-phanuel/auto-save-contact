import * as Contacts from "expo-contacts";

async function saveContactIfNotExists(name: string, phoneNumber: string) {
  // 📱 Vérifier permission
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Permission refusée");
    return;
  }

  // 🔍 Vérifier si le numéro existe déjà
  const existingContacts = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const exists = existingContacts.data.some((contact) =>
    contact.phoneNumbers?.some(
      (phone) =>
        phone.number?.replace(/\s+/g, "") === phoneNumber.replace(/\s+/g, "")
    )
  );

  if (exists) {
    console.log(`⚠️ ${phoneNumber} déjà présent`);
    return;
  }

  // ✅ Créer un nouveau contact
  const newContact: Contacts.Contact = {
    id: "",
    contactType: Contacts.ContactTypes.Person,
    name: name || "Inconnu",
    [Contacts.Fields.FirstName]: name || "Inconnu",
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
    console.log(`✅ ${name} ajouté : ${phoneNumber}`);
  } catch (error) {
    console.error(`❌ Erreur ajout ${name} :`, error);
  }
}

export default saveContactIfNotExists;
