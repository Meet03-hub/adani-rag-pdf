import * as dotenv from "dotenv";
dotenv.config();

import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { SYSTEM_PROMPT } from "./prompt.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const chatHistory = [];

  async function ask() {
    rl.question("\n❓ Question: ", async (question) => {
      const results = await vectorStore.similaritySearchWithScore(question, 5);

      console.log("\n🔍 Retrieved Context:");
      results.forEach(([doc, score], i) => {
        console.log(
          `#${i + 1} [p${doc.metadata.page}:c${doc.metadata.chunk}] score=${score.toFixed(3)}`
        );
        console.log(doc.pageContent.slice(0, 200), "\n");
      });

      const context = results
        .map(
          ([doc]) =>
            `[p${doc.metadata.page}:c${doc.metadata.chunk}]\n${doc.pageContent}`
        )
        .join("\n\n");

      const prompt = `
${SYSTEM_PROMPT}

Conversation so far:
${chatHistory.join("\n")}

Context:
${context}

Question:
${question}

Answer:
`;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

      console.log("\n✅ Answer:\n", answer);

      chatHistory.push(`Q: ${question}`);
      chatHistory.push(`A: ${answer}`);

      ask();
    });
  }

  ask();
}

main();
