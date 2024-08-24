const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

// mongoose.connect("mongodb+srv://dharaniayyavu:Dharani@2103@cluster0.jgtkj.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0")
//   .then(() => console.log("Connected to DB"))
//   .catch(() => console.log("Failed to connect"));
mongoose.connect("mongodb+srv://dharaniayyavu:Dharani%402103@cluster0.jgtkj.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // 30 seconds
})
  .then(() => {
    console.log("Connected to DB");
    setupMailer();
  })
  .catch(error => {
    console.error("Failed to connect", error);
  });

const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String,
});

const Credential = mongoose.model("Credential", credentialSchema, "bulkmail");

let transporter;

const setupMailer = async () => {
  try {
    const credentials = await Credential.findOne().exec();
    if (!credentials) {
      throw new Error("No credentials found in database");
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: credentials.user,
        pass: credentials.pass,
      },
    });
    
    console.log("Mailer setup complete");

  } catch (error) {
    console.error("Error setting up mailer:", error);
  }
};

setupMailer();

app.post('/sendmail', async (req, res) => {
  const { emails, subject, message } = req.body;

  // Validate input
  if (!emails || !subject || !message) {
    return res.status(400).send('Missing required fields');
  }

  if (!transporter) {
    return res.status(500).send('Mailer not initialized');
  }

  const mailOptions = {
    from: 'dharaniayyavu@gmail.com',
    to: emails.join(', '),
    subject: subject,
    text: message,
  };

  try {
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    console.log('Email sent:', info.response);
    res.send('Emails sent successfully');
  } catch (error) {
    // Handle errors
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});

// app.get("/sendmail",function(req,res){
//     transporter.sendMail({
//         from:"dharaniayyavu@gmail.com",
//         to:"dharaniayyavu@gmail.com",
//         // subject:"Message from bulkmailer",
//         text: "Hello"
//     },
//     function(error,info){
//         if(error){
//             console.log(error)
//             res.send("Error")
//         }else{
//             console.log(info)
//             res.send("Success")
//         }
//     }
//     )
// })

// app.listen(5000,function(){
//     console.log("server started")
// })