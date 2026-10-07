import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer("all-MiniLM-L6-v2")

DIM = 384
index = faiss.IndexFlatL2(DIM)

chunks_store = []


def add_to_index(chunks):
    global chunks_store, index

    embeddings = embedder.encode(chunks)

    index.add(np.array(embeddings))
    chunks_store.extend(chunks)


def retrieve(query, k=3):
    query_vec = embedder.encode([query])

    distances, ids = index.search(np.array(query_vec), k)

    return [chunks_store[i] for i in ids[0] if i < len(chunks_store)]