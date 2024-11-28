import path from "path";
import { promises as fs } from "fs";

export async function POST(req) {
  try {
    const body = await req.json();

    // Verify the incoming message is from Facebook
    if (body.object !== "page") {
      return new Response("Invalid Request", { status: 400 });
    }

    const entry = body.entry[0];
    const messaging = entry.messaging[0];
    const senderId = messaging.sender.id;
    const message = messaging.message?.text;

    // Load JSON file
    const filePath = path.join(process.cwd(), "data", "answers.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    // Determine the response
    let response = "Sorry, I didn't understand that.";
    if (data[message.toLowerCase()]) {
      response = data[message.toLowerCase()];
    }

    // Send the response back to the sender
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
    await fetch(
      `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: response },
        }),
      }
    );

    return new Response("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error", { status: 500 });
  }
}

export async function GET(req) {
  const url = new URL(req.url);

  // Parse query parameters sent by Facebook
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // Ensure this matches your configuration

  // Verify the token and respond to Facebook's challenge
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Forbidden", { status: 403 });
  }
}
