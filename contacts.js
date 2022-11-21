const fs = require("fs").promises;
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.join(__dirname, "/db/contacts.json");

const getContactsList = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
};

async function listContacts() {
  try {
    const contacts = await getContactsList();
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.log("Error", error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContactsList();

    const result = contacts.find((contact) => contact.id === String(contactId));
    console.table(result);
    return result;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const list = await getContactsList();
    const result = list.filter(
      (contact) => contact.id !== contactId.toString()
    );
    await fs.writeFile(contactsPath, JSON.stringify(result), "utf-8");
    const newContacts = await getContactsList();
    console.table(newContacts);
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContactsList();
    const id = shortid.generate();

    const newContact = { id, name, email, phone };
    const createdNewList = [...contacts, newContact];

    if (contacts.find((e) => e.email === newContact.email)) {
      console.log("Contact with this email already exists");
      return;
    }
    const newListContacts = JSON.stringify(createdNewList);

    await fs.writeFile(contactsPath, newListContacts, "utf-8");

    const updatedListContacts = await getContactsList();
    console.table(updatedListContacts);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
