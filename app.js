const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const mv = require('mv');
const formidable = require('formidable');
const fs = require('fs');
// let ejs = require('ejs');

const app = express();
const port = 3000;

const fasilitas1 = ['Kompor', 'Kasur', 'Dapur', 'Kulkas', 'WC'];
const fasilitas2 = ['Meja', 'Kursi', 'Lemari', 'Bantal'];
const kontak = {
    email: 'sesuatu@gmail.com',
    whatsApp: '081390608263',
    telepon: '081390608263'
};
const gambar = ["./upload/WhatsApp Image 2023-05-10 at 18.09.35.jpeg"];

const user = 'admin';
const pass = '1234567';
let user_;
let pass_;
let today = new Date();
let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    minute: "numeric",
    second: "numeric"
};

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render('./user/user.ejs', {
        fasilitas1: fasilitas1,
        fasilitas2: fasilitas2,
        email: kontak.email,
        whatsApp: kontak.whatsApp,
        telepon: kontak.telepon,
        gambar: gambar
    });
});

app.get('/admin', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    res.render('./admin/admin.ejs', {
        fasilitas1: fasilitas1,
        fasilitas2: fasilitas2,
        email: kontak.email,
        whatsApp: kontak.whatsApp,
        telepon: kontak.telepon,
        gambar: gambar
    });
})

app.post('/fasilitas1', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const fasilitas_1 = req.body.tambahFasilitas1;
    fasilitas1.push(fasilitas_1);
    res.redirect('/admin');
})

app.post('/hapusFasilitas1', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const hapusFasilitas1 = req.body.btnHapus1;
    fasilitas1.splice(hapusFasilitas1, 1);
    res.redirect('/admin');
})

app.post('/hapusFasilitas2', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const hapusFasilitas2 = req.body.btnHapus2;
    fasilitas2.splice(hapusFasilitas2, 1);
    res.redirect('/admin');
})

app.post('/fasilitas2', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const fasilitas_2 = req.body.tambahFasilitas2
    fasilitas2.push(fasilitas_2)
    res.redirect('/admin')
})

app.post('/gantiEmail', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const email_ = req.body.email;
    if (email_ != '') {
        kontak.email = email_;
        return res.redirect('/admin');
    }
    return res.send('<h1>Email Kosong</h1> <form action="/admin" method="get"><button type="submit">kembali</button></form>')
})

app.post('/gantiWa', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const whatsApp_ = req.body.whatsApp;
    if (whatsApp_ != '') {
        kontak.whatsApp = whatsApp_;
        return res.redirect('/admin');
    }
    return res.send('<h1>WhatsApp Kosong</h1> <form action="/admin" method="get"><button type="submit">kembali</button></form>')
})

app.post('/gantiTelepon', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const telepon_ = req.body.telepon;
    if (telepon_ != '') {
        kontak.telepon = telepon_;
        return res.redirect('/admin');
    }
    return res.send('<h1>Telepon Kosong</h1> <form action="/admin" method="get"><button type="submit">kembali</button></form>')
})

app.post('/gambar', (req, res, next) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {

        const oldPath = files.fileUpload.filepath;

        const newPath = __dirname + '/public/upload/' + files.fileUpload.originalFilename;
        gambar.push('./upload/' + files.fileUpload.originalFilename);

        mv(oldPath, newPath, function (err) {
            if (err) {
                console.log(err);
            }

            console.log('file uploaded successfully');
        });

        res.redirect('/admin');

    });

});

app.post('/hapusGambar1', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const hapus1 = req.body.btnHapus1;

    gambar.splice(hapus1, 1);
    res.redirect('/admin');
})

app.post('/hapusGambar2', (req, res) => {
    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    const hapus2 = req.body.btnHapus2;

    gambar.splice(hapus2, 1);
    res.redirect('/admin');
})

app.get('/login', (req, res) => {
    res.render('./login/login.ejs', {
        userName: '',
        password: ''
    });
})

app.post('/login', (req, res) => {
    user_ = req.body.txtUser;
    pass_ = req.body.txtPass;

    if (user_ != user && pass_ != pass) {
        return res.send('<h1>User Name atau Kata Sandi Salah</h1><form action="/login" method="get"><button type="submit">Kembali ke Halaman Login</button></form>');
    }

    res.redirect('/admin');
})

app.post('/logout', (req, res) => {
    user_ = '';
    pass_ = '';

    res.redirect('/login');
})

app.listen(port, () => {
    console.log("server jalan di Port " + port);
});
