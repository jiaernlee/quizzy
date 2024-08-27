import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";
import clientPromise from "./mongodb";
import handlebars from "handlebars";

const sendMail = async (
  orgId: string,
  code: string,
  title: string,
  description: string
) => {
  await clientPromise;

  const emailTemplatePath = join(process.cwd(), "emails/email-template.html");
  const emailSource = readFileSync(emailTemplatePath, "utf-8");
  const template = handlebars.compile(emailSource);

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  try {
    const client = await clientPromise;
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const students = await usersCollection
      .find({
        role: "student",
        organization: orgId,
      })
      .toArray();

    if (students.length === 0) {
      console.log("no students found");
      return;
    }

    for (const student of students) {
      const emailHtml = template({ code, title, description });

      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: student.email,
        subject: "New Quiz Set Posted",
        html: emailHtml,
      };

      await transport.sendMail(mailOptions);
      console.log(`Email sent to: ${student.email}`);
    }
    console.log("Emails sent successfully to all students");
  } catch (e) {
    console.error("failed to send email: ", e);
  }
};

export { sendMail };
