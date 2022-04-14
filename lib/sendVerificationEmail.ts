import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

const SES = new SESClient({
  region: "us-east-1",
});

const sendEmail = async (address: string, verification: string) => {
  let inDevEnvironment = false;

  if (process && process.env.NODE_ENV === "development") {
    inDevEnvironment = true;
  }

  const verificationString = inDevEnvironment
    ? `http://localhost:3000/verify/${verification}`
    : `https://course-o-meter.com/verify/${verification}`;

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
              <h1> Please verify your email to proceed with registration</h1>
              <p>Kindly use the link below to verify your email address.<p/>
              <a href="${verificationString}">Verify email</a>
              <p>Thank you for choosing Course-O-Meter and the Course-O-Matic course review system.<p/>
            </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Verify your email for Course-O-Meter`,
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
