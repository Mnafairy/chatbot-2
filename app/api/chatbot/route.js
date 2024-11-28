import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get the 'option' query parameter
    const url = new URL(req.url);
    const option = url.searchParams.get("option");

    // Path to the JSON file
    const filePath = path.join(process.cwd(), "data", "answers.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    // Get the answer based on the option
    const answer = data[option];
    if (!answer) {
      return NextResponse.json({ answer: "Sorry, no information available." });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return NextResponse.json({ answer: "Error retrieving information." });
  }
}
