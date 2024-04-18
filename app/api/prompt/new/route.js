import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export async function POST(req) {
  const { userId, prompt, tag } = await req.json();

  try {
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId,
      tag,
      prompt,
    });
    console.log("newPrompt", newPrompt);

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt" + error, {
      status: 500,
    });
  }
}
