# Adani RAG PDF – Gemini + Pinecone

This project demonstrates a **Retrieval-Augmented Generation (RAG)** pipeline using **Gemini** for embeddings and LLM inference, and **Pinecone** as the vector database.  
It indexes a PDF document and enables conversational question-answering over its content.

---

## Prerequisites

- Node.js (v18 or later)
- A Pinecone account
- A Gemini API key (for embeddings and LLM inference)

---

## Setup & Execution

```bash
# Step 1: Clone the repository
git clone https://github.com/Meet03-hub/adani-rag-pdf.git
cd adani-rag-pdf

# Step 2: Install dependencies
npm install

# Step 3: Configure environment variables
# Create .env file from example
copy .env.example .env

# Edit the .env file and add your API keys:
# GEMINI_API_KEY=your_api_key_here                  
# PINECONE_API_KEY=your_api_key_here                My PineconeApiKey---  pcsk_W2p1v_QhrNNp3UE1xTGW1S3PZgfxqkKUJkHL7WVnFwkifuj9Rdo852wr3jWqssVsDR97G
# PINECONE_INDEX_NAME=rag-pdf-index

# Step 4: Index the PDF (one-time operation)
node src/index.js "./data/AEL Press Release Q2 FY26.pdf"

# Step 5: Start the conversational chat
node src/chat.js
