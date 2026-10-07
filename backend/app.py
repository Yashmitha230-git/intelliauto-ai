from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import re
import pdfplumber
from groq import Groq

app = FastAPI(title="IntelliAuto AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatRequest(BaseModel):
    query: str
    filename: Optional[str] = None

def extract_pdf_text(filename: str) -> str:
    """Extracts clean human-readable text using pdfplumber."""
    if not filename:
        files = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".pdf")]
        if not files:
            return ""
        filename = sorted(files, key=lambda x: os.path.getmtime(os.path.join(UPLOAD_DIR, x)))[-1]

    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return ""

    extracted_content = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                
                cleaned_lines = []
                for line in text.splitlines():
                    line_str = line.strip()
                    if re.match(r"^[-+]?\d*\.\d+$", line_str) or re.match(r"^\d+$", line_str):
                        continue
                    if len(line_str) > 2:
                        cleaned_lines.append(line_str)
                
                page_text = "\n".join(cleaned_lines)
                if page_text:
                    extracted_content += f"\n--- Page {i+1} ---\n" + page_text
    except Exception as e:
        print(f"Error reading PDF {filename}: {e}")

    return extracted_content.strip()

@app.get("/api/dashboard")
async def get_dashboard():
    pdf_files = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".pdf")]
    return {
        "stats": {
            "total_docs": len(pdf_files),
            "system_status": "Active",
            "engine": "FastAPI + Groq Llama 3"
        },
        "recent_documents": pdf_files
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")

        file_path = os.path.join(UPLOAD_DIR, file.filename)
        contents = await file.read()
        
        with open(file_path, "wb") as f:
            f.write(contents)

        return {
            "message": "File uploaded successfully",
            "name": file.filename,
            "size": f"{round(len(contents) / (1024 * 1024), 2)} MB" if contents else "0.1 MB"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def process_chat(req: ChatRequest):
    query = req.query.strip()
    filename = req.filename or ""

    pdf_text = extract_pdf_text(filename)
    
    if not pdf_text:
        return {
            "answer": "Could not extract text from this PDF.",
            "citation": "System"
        }

    # Strict token limit safeguard (first 250 words)
    words = pdf_text.split()
    truncated_text = " ".join(words[:250])

    prompt = f"""
    Analyze the uploaded document content below and answer the user question.

    DOCUMENT CONTENT:
    {truncated_text}

    USER QUESTION: {query}
    
    Provide a concise, direct answer based strictly on the document text above.
    """

    api_key = "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"
    client = Groq(api_key=api_key)

    answer = None
    last_error = None

    try:
        # Dynamically discover supported text models from your API key
        models_data = client.models.list().data
        all_models = [m.id for m in models_data]
        
        # Filter for text completion models (excluding vision, whisper, audio, guard)
        text_models = [
            m for m in all_models 
            if not any(x in m.lower() for x in ["vision", "whisper", "guard", "audio"])
        ]

        if not text_models:
            text_models = all_models  # Fallback to any model available

        print(f"Detected available text models: {text_models}")

        # Try models in order until one succeeds
        for model_name in text_models:
            try:
                print(f"Attempting completion with: {model_name}")
                completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=model_name,
                    max_tokens=250,
                    temperature=0.2
                )
                answer = completion.choices[0].message.content
                if answer:
                    break
            except Exception as err:
                last_error = str(err)
                print(f"Model {model_name} failed: {err}")

    except Exception as e:
        last_error = str(e)

    if not answer:
        answer = f"Error processing query: {last_error}"

    return {
        "answer": answer,
        "citation": f"Document: {filename if filename else 'Active Document'}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)