const Imap = require("imap");
const imap = new Imap({
  user: "",
  password: "",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
  debug: console.log, // enable debug output
});

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

imap.once("ready", function () {
  openInbox(function (err, box) {
    if (err) throw err;

    // Listen for new email notifications
    imap.on("mail", function (numNewMsgs) {
      console.log(`You have ${numNewMsgs} new messages`);

      // Fetch the new email and parse its content
      const f = imap.seq.fetch(box.messages.total + ":*", { bodies: "" });
      f.on("message", function (msg, seqno) {
        msg.on("body", function (stream, info) {
          simpleParser(stream, (err, parsed) => {
            if (err) throw err;
            console.log(parsed.subject); // Log the email subject
            console.log(parsed.text); // Log the email content
          });
        });
      });
      f.once("error", function (err) {
        console.log("Fetch error: " + err);
      });
      f.once("end", function () {
        console.log("Done fetching all messages!");
      });
    });
  });
});

imap.once("error", function (err) {
  console.log(err);
});

imap.once("end", function () {
  console.log("Connection ended");
});

imap.connect();
