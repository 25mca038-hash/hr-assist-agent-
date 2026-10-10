import { DocumentChunk, DocumentType, RetrievalResult } from '../types';
import { generateEmbedding, cosineSimilarity } from './embeddings';

export class VectorStore {
  private chunks: DocumentChunk[] = [];

  constructor(initialChunks: DocumentChunk[] = []) {
    this.chunks = initialChunks;
  }

  public getAllChunks(): DocumentChunk[] {
    return this.chunks;
  }

  public setChunks(chunks: DocumentChunk[]): void {
    this.chunks = chunks;
  }

  /**
   * Add chunks for a document, indexing their embeddings if not already computed
   */
  public async addChunks(newChunks: DocumentChunk[]): Promise<void> {
    for (const chunk of newChunks) {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        chunk.embedding = await generateEmbedding(chunk.text);
      }
      // Avoid duplicate chunk IDs
      const existingIdx = this.chunks.findIndex(c => c.id === chunk.id);
      if (existingIdx >= 0) {
        this.chunks[existingIdx] = chunk;
      } else {
        this.chunks.push(chunk);
      }
    }
  }

  /**
   * Remove all chunks associated with a specific document
   */
  public removeDocument(documentId: string): void {
    this.chunks = this.chunks.filter(c => c.documentId !== documentId);
  }

  /**
   * Hybrid Vector + Lexical Keyword Search
   */
  public async similaritySearch(
    query: string,
    options: {
      topK?: number;
      documentType?: DocumentType;
      minScore?: number;
    } = {}
  ): Promise<RetrievalResult[]> {
    const topK = options.topK || 5;
    const minScore = options.minScore || 0.15;

    if (this.chunks.length === 0 || !query.trim()) {
      return [];
    }

    const queryEmbedding = await generateEmbedding(query);
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    // Filter by document type if requested
    const eligibleChunks = options.documentType
      ? this.chunks.filter(c => c.documentType === options.documentType)
      : this.chunks;

    const scored: RetrievalResult[] = [];

    for (const chunk of eligibleChunks) {
      if (!chunk.embedding) continue;

      const vectorSim = cosineSimilarity(queryEmbedding, chunk.embedding);

      // Lexical keyword and title matching boosts
      const chunkLower = chunk.text.toLowerCase();
      const titleLower = chunk.documentTitle.toLowerCase();
      const sectionLower = (chunk.sectionTitle || '').toLowerCase();

      let matchCount = 0;
      let titleMatchCount = 0;
      for (const word of queryWords) {
        if (chunkLower.includes(word)) {
          matchCount++;
        }
        if (titleLower.includes(word)) {
          titleMatchCount++;
        }
        if (sectionLower.includes(word)) {
          titleMatchCount += 0.5;
        }
      }

      const lexicalScore = queryWords.length > 0 ? (matchCount / queryWords.length) * 0.35 : 0;
      const titleScore = queryWords.length > 0 ? Math.min(0.45, (titleMatchCount / queryWords.length) * 0.45) : 0;

      // Combined hybrid score (semantic vector + lexical + title relevance)
      const combinedScore = Math.min(1.0, vectorSim * 0.45 + lexicalScore + titleScore);

      if (combinedScore >= minScore) {
        scored.push({
          chunk,
          similarityScore: Math.round(combinedScore * 1000) / 1000,
        });
      }
    }

    // Sort descending by score
    scored.sort((a, b) => b.similarityScore - a.similarityScore);

    return scored.slice(0, topK);
  }
}

export const globalVectorStore = new VectorStore();
