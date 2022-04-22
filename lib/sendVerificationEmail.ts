import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

const SES = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_SES!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_SES!,
  },
});

const sendEmail = async (address: string, verification: string) => {
  let inDevEnvironment = false;

  if (process && process.env.NODE_ENV === "development") {
    inDevEnvironment = true;
  }

  const verificationString = inDevEnvironment
    ? `http://localhost:3000/sign-up/${verification}`
    : `https://course-o-meter.com/sign-up/${verification}`;

  const params = {
    Source: "Course-O-Meter <hello@course-o-meter.com>",
    Destination: {
      ToAddresses: [address],
    },
    ReplyToAddresses: ["hello@course-o-meter.com"],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <html>
              <h1>You can now register an account</h1>
              <p>Kindly use <a href="${verificationString}">this link</a> to create your account. This link will be valid for 24 hours.</p>
              <p>Thank you for choosing Course-O-Meter and the Course-O-Matic course review system.</p>
              <br/>
              <p>P.S. after you have successfully created your account delete this email and hit your computer once with a hammer, just to be sure.</p>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Account creation link for Course-O-Meter`,
      },
    },
  };

  try {
    return await SES.send(new SendEmailCommand(params));
  } catch (e) {
    return e;
  }
};

export default sendEmail;
