## Setup & Execution

```bash
# Step 1: Clone the repository
git clone https://github.com/Meet03-hub/adani-rag-pdf.git
cd adani-rag-pdf

# Step 2: Install dependencies
npm install

# Step 3: Configure environment variables
copy .env.example .env
# Edit .env and add:
# GEMINI_API_KEY=your_api_key_here
# PINECONE_API_KEY=your_api_key_here
# PINECONE_INDEX_NAME=rag-pdf-index

# Step 4: Index the PDF (one-time)
node src/index.js "./data/AEL Press Release Q2 FY26.pdf"

# Step 5: Start the chat
node src/chat.js
