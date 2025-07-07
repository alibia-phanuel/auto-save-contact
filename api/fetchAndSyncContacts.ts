import saveContactIfNotExists from "../utils/saveContact";
import api from "./api";
async function fetchAndSyncContacts() {
  try {
    const response = await api.get("/numeros");
    const data = response.data; // [{ name, numero }]
    console.log(`📥 ${data.length} numéros récupérés`);

    for (const item of data) {
      await saveContactIfNotExists(item.name, item.numero);
    }
  } catch (error) {
    console.error("❌ Erreur API :", error);
  }
}
export default fetchAndSyncContacts;
