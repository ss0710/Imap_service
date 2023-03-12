require("dotenv").config();
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const imapConfig = {
  user: process.env.MAIL,
  password: process.env.PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

const getEmails = () => {
  try {
    const imap = new Imap(imapConfig);
    imap.once("ready", () => {
      imap.openBox("INBOX", false, () => {});
    });

    imap.once("error", (err) => {
      console.log("printing error");
      console.log(err);
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (ex) {
    console.log("an error occurred");
  }
};

getEmails();
