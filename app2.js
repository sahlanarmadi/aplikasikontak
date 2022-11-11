const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts} = require("./utils/contacts");
const {body, validationResult, check} = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

//menggunakan vie engine EJS 
app.set("view engine", "ejs");

//build in third farty middleware
app.use(expressLayouts);
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.urlencoded({extended: true}));


//build in-middleware ( membuat file(statis) public agar bisa diakses, termasuk img, css dan file lain2nya )
app.use(express.static("public"));

// configurasu flash
app.use(cookieParser("secret"));
app.use(session({
        cookie: {maxAge: 1000},
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

app.get("/", (req, res) => {
    res.render("index", {
        layout: "layouts/main-layout",
        title: "Halaman Home",
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        layout: "layouts/main-layout",
        title: "Halaman About"
    });
});

app.get("/contact", (req, res) => {
    const contacts = loadContact();
    res.render("contact", {
        layout: "layouts/main-layout",
        title: "Halaman contact",
        contacts,
        msg: req.flash("msg"),
    });
});

// halaman form tambah data contac
app.get("/contact/add", (req, res) => {
    res.render("add-contact", {
        title: "Form tambah data kontak",
        layout: "layouts/main-layout",
    });
});

// proses penambahan data contact
app.post("/contact", [
    body("nama").custom((value) => {
        const duplikat = cekDuplikat(value);
        if(duplikat){
            throw new Error("Maaf nama sudah digunakan");
        }
        return true;
    }),
    check("email", "Email tidak valid...!!").isEmail(), 
    check("noHp", "Nomor Hp tidak valid...!").isMobilePhone("id-ID")
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()});
        res.render("add-contact", {
            title: "Form Tambah data kontak",
            layout: "layouts/main-layout",
            errors: errors.array(),
        });
    }else{
        addContact(req.body);
        // kirimkan pesan dulu
        // console.log(msg);
        req.flash("msg", "Data kontak berhasil di tambahkan");
        res.redirect("/contact");
    }
});

// untuk halam delete
app.get("/contact/delete/:nama", (req, res) => {
    const contact = findContact(req.params.nama);

    if(!contact){
        res.status(404);
        res.send("<h1>404</h1>");
    }else{
        deleteContact(req.params.nama);
        req.flash("msg", "Data kontak berhasil di hapus");
        res.redirect("/contact");
    }
})

// form ubah data contact
app.get("/contact/edit/:nama", (req, res) => {
    const contact = findContact(req.params.nama);

    res.render("edit-contact", {
        title: "Form edit data contact",
        layout: "layouts/main-layout",
        contact,
    });
});

// prosses ubah data contact
app.post("/contact/update", [
    body("nama").custom((value, {req}) => {
        const duplikat = cekDuplikat(value);
        if(value !== req.body.oldName && duplikat){
            throw new Error("Maaf nama sudah digunakan");
        }
        return true;
    }),
    check("email", "Email tidak valid...!!").isEmail(), 
    check("noHp", "Nomor Hp tidak valid...!").isMobilePhone("id-ID")
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()});
        res.render("edit-contact", {
            title: "Form ubah data kontak",
            layout: "layouts/main-layout",
            errors: errors.array(),
            contact: req.body,
        });
    }else{
        updateContacts(req.body);
        req.flash("msg", "Data kontak berhasil di ubah");
        res.redirect("/contact");
    }
});

// halaman detail contact
app.get("/contact/:nama", (req, res) => {
    const contact = findContact(req.params.nama);

    res.render("detail", {
        layout: "layouts/main-layout",
        title: "Halaman detail contact",
        contact,
    });
});

app.use("/", (req, res) => {
    res.status(404);
    res.send('404');
})

app.listen(port, () => {
    console.log(`server anda berhasil di ${port}`);
})