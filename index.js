const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'subscription_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'maratheneha1204@gmail.com',
        pass: 'eise vzia oyxf wilw'
    }
});

app.post('/subscribe', (req, res) => {
    const email = req.body.email;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ message: 'You have already subscribed' });
        } else {
            db.query('INSERT INTO users (email) VALUES (?)', [email], (err, results) => {
                if (err) throw err;
                const mailOptions = {
                    from: 'maratheneha1204@gmail.com',
                    to: email,
                    subject: 'Subscription Confirmation',
                    text: 'Thank you for subscribing!'
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.json({ message: 'Error sending email' });
                    }
                    res.json({ message: 'Subscribed successfully and email sent' });
                });
            });
        }
    });
});

app.post('/unsubscribe', (req, res) => {
    const email = req.body.email;
    db.query('DELETE FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        const mailOptions = {
            from: 'maratheneha1204@gmail.com',
            to: email,
            subject: 'Unsubscription Confirmation',
            text: 'You have been unsubscribed'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({ message: 'Error sending email' });
            }
            res.json({ message: 'Unsubscribed successfully and email sent' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
