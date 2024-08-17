import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { message } = await req.json();
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'llama3-8b-8192',
    });

    return NextResponse.json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}