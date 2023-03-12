const Imap = require("imap"),
  inspect = require("util").inspect;
const { simpleParser } = require("mailparser");

var fun = function () {
  const myMail = "";
  const myPwd = "";
  let getEmailFromInbox = (imap) => {
    imap.openBox("INBOX", false, function (err, box) {
      if (err) throw err;

      imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
        try {
          const f = imap.fetch(results, { bodies: "" });
          f.on("message", (msg) => {
            msg.on("body", (stream) => {
              simpleParser(stream, async (err, parsed) => {
                // const {from, subject, textAsHtml, text} = parsed;
                console.log(parsed);
                console.log(parsed.from.text);
                console.log(parsed.to.text);
                console.log(parsed.textAsHtml);
                console.log(parsed.text);
                console.log(parsed.subject);
                console.log(parsed.date);
                /* Make API call to save the data
                 Save the retrieved data into a database.
                 E.t.c
              */
              });
            });
            msg.once("attributes", (attrs) => {
              const { uid } = attrs;
              imap.addFlags(uid, ["\\Seen"], () => {
                // Mark the email as read after reading it
                console.log("Marked as read!");
              });
            });
          });
          f.once("error", (ex) => {
            return Promise.reject(ex);
          });
          f.once("end", () => {
            console.log("Done fetching all messages!");
            imap.end();
          });
        } catch (err) {
          console.log("No new emails");
        }
      });
    });
  };

  let createLabel = (mailServer, labelName) => {
    mailServer.addBox(labelName, (err) => {});
    console.log("message", "New Label or Box Created");
  };

  let getMailboxStatusByName = (mailServer, inboxName) => {
    mailServer.status(inboxName, (err, mailbox) => {
      console.log("message", mailbox);
    });
    console.log("message", "Label or Box Status");
  };

  let getMailBoxLabels = (mailServer) => {
    mailServer.getBoxes((error, mailbox) => {
      console.log("message", mailbox);
    });
  };

  let deleteLabel = (mailServer, labelName) => {
    mailServer.delBox(labelName, (error) => {});
    console.log("message", "Label or Box removed");
  };

  let mailServer1 = new Imap({
    user: myMail,
    password: myPwd,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
    authTimeout: 3000,
  }).once("error", function (err) {
    console.log("Source Server Error:- ", err);
  });
  mailServer1.once("ready", function () {
    mailServer1.openBox("INBOX", true, function (err, box) {
      if (err) throw err;
      console.log("message", "server1 ready");
    });

    // mail operation
    //getMailBoxLabels(mailServer1);
    getEmailFromInbox(mailServer1);
    //createLabel(mailServer1, "demo-label1");
    //deleteLabel(mailServer1, "demo-label1");
    //getMailboxStatusByName(mailServer1, "INBOX");
  });

  mailServer1.connect();
};

setInterval(fun, 10000);
