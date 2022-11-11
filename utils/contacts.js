const fs = require("fs");

//membuat folder data jika belum ada
const dirPath = "./data";
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

//membuaut file json yangbelum ada
const dataPath = "./data/contacts.json"
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, "[]", "utf-8")
}

// mengambil semua data contacts.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

// mencari contact berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
}

// menimpa/menukar isi file contacts.json dengan file yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// menambahkan data contact baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

// cek nama yang diplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);
};

// fungsi hapus kontak
const deleteContact = (nama) => {
    const contacts = loadContact();
    const filterContact = contacts.filter((contact) => contact.nama != nama);
    saveContacts(filterContact);
};

// mengubah contact
const updateContacts = (contactBaru) => {
    const contacts = loadContact();
    // hilangkan contac lama yang namanya sma dengan oldnama
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldName);
    delete contactBaru.oldName;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);  
}

module.exports = {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts};