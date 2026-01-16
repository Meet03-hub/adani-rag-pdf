import * as dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

async function indexing(pdfPath) {
  console.log("📄 Loading PDF...");
  const loader = new PDFLoader(pdfPath, { splitPages: true });
  const docs = await loader.load();

  // Add page numbers
  docs.forEach((doc, i) => {
    doc.metadata.page = i + 1;
  });

  console.log("✂️ Chunking text...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  // Add chunk IDs
  chunks.forEach((chunk, i) => {
    chunk.metadata.chunk = i;
  });

  console.log(`🔢 Total chunks created: ${chunks.length}`);

  console.log("🧠 Creating embeddings...");
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  console.log("📦 Uploading vectors to Pinecone...");
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex: index,
  });

  console.log("✅ Indexing completed successfully");
}

// -------- CLI ENTRY POINT --------
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error("❌ Please provide a PDF path");
  console.error("Usage: node src/index.js <pdf-path>");
  process.exit(1);
}

indexing(pdfPath);
