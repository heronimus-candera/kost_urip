const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const mv = require('mv');
const formidable = require('formidable');
const fs = require('fs')
const { log } = require('console');
// let ejs = require('ejs');

const app = express();
const port = 3000;

const fasilitas1 = ['Kompor','Kasur','Dapur','Kulkas','WC'];
const fasilitas2 = ['Meja','Kursi','Lemari','Bantal'];
const kontak = {email: 'sesuatu@gmail.com',
whatsApp: '081390608263',
telepon: '081390608263'};
const gambar = ["https://drive.google.com/uc?export=view&id=1NepIAcYxGNWQYsWTo--D8ozju_0zeA1b", "https://shared.cdn.smp.schibsted.com/v2/images/782003a2-5f1d-4ff3-95b1-1c38c4d1d53e?fit=crop&format=auto&h=847&w=1505&s=58f5960b58ab76b277b38eb62877c6f0c888cd60"];

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render('./user/user.ejs', {
        fasilitas1 : fasilitas1,
        fasilitas2:fasilitas2,
        email: kontak.email,
        whatsApp: kontak.whatsApp,
        telepon: kontak.telepon
    });
});

app.get('/admin', (req,res) => {
    res.render('./admin/admin.ejs', {
        fasilitas1:fasilitas1,
        fasilitas2:fasilitas2,
        email: kontak.email,
        whatsApp: kontak.whatsApp,
        telepon: kontak.telepon
    });
})

app.post('/fasilitas1', (req, res) => {
    const fasilitas_1 = req.body.tambahFasilitas1;
    fasilitas1.push(fasilitas_1);
    res.redirect('/admin');
})

app.post('/hapusFasilitas1', (req,res) => {
    const hapusFasilitas1 = req.body.btnHapus1;
    fasilitas1.splice(hapusFasilitas1, 1);
    res.redirect('/admin');
})

app.post('/hapusFasilitas2', (req,res) => {
    const hapusFasilitas2 = req.body.btnHapus2;
    fasilitas2.splice(hapusFasilitas2, 1);
    res.redirect('/admin');
})

app.post('/fasilitas2', (req,res) => {
    const fasilitas_2 = req.body.tambahFasilitas2
    fasilitas2.push(fasilitas_2)
    res.redirect('/admin')
})

app.post('/gantiEmail', (req,res) => {
    const email_ = req.body.email;
    if(email_ != ''){
        kontak.email = email_;
        return res.redirect('/admin');
    }
    return res.send('<h1>Email Kosong</h1> <form action="/admin" method="get"><button type="submit">kembali</button></form>')
})

app.post('/gantiWa', (req,res) => {
    const whatsApp_ = req.body.whatsApp;
    if(whatsApp_ != ''){
        kontak.whatsApp = whatsApp_;
        return res.redirect('/admin');
    }
    return res.send('<h1>WhatsApp Kosong</h1> <form action="/admin" method="get"><button type="submit">kembali</button></form>')
})

app.post('/gantiTelepon', (req,res) => {
    const telepon_ = req.body.telepon;
    if(telepon_ != ''){
        kontak.telepon = telepon_;
        return res.redirect('/admin');
    }
    return res.send('<h1>Telepon Kosong</h1> <form action="/admin" method="get"><button type="submit">kembali</button></form>')
})

app.post('/gambar', (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
        const oldPath = files.fileUpload.filepath;
        const newPath = __dirname + '/upload/' + files.fileUpload.originalFilename;

        gambar.push(newPath);

        mv(oldPath, newPath, function (err) {
            if (err) { console.log(err); }
            console.log('file uploaded successfully');
            return res.end("file uploaded successfully");
        });

        res.redirect('/admin');
  });

});

app.listen(port, () => {
    console.log("server jalan di Port " + port);
});