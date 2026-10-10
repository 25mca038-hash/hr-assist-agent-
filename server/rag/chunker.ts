import { DocumentChunk, DocumentType } from '../types';

/**
 * Document chunker module for RAG pipeline.
 * Splits cleaned text into overlapping chunks with section and position tracking.
 */

export function cleanText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\t\f\v]/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface ChunkOptions {
  maxChunkSize?: number; // target characters per chunk (~150-250 words)
  overlap?: number;      // overlapping characters to preserve cross-boundary context
}

export function chunkDocument(
  documentId: string,
  documentType: DocumentType,
  documentTitle: string,
  text: string,
  options: ChunkOptions = {}
): DocumentChunk[] {
  const maxChunkSize = options.maxChunkSize || 650;
  const overlap = options.overlap || 120;

  const cleaned = cleanText(text);
  if (!cleaned) return [];

  // Split into paragraphs first to avoid cutting through sentences where possible
  const paragraphs = cleaned.split(/\n\s*\n/);
  const chunks: DocumentChunk[] = [];
  let currentBuffer = '';
  let currentSection = 'General Overview';
  let partIndex = 1;

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // Detect section headers (e.g., "EDUCATION", "SKILLS", "SECTION 3:", etc.)
    const isHeading =
      trimmedPara.length < 80 &&
      (trimmedPara.endsWith(':') ||
        trimmedPara === trimmedPara.toUpperCase() ||
        /^(Section|Chapter|Article|Part|\d+\.)/i.test(trimmedPara) ||
        /^(Education|Experience|Skills|Summary|Responsibilities|Requirements|Qualifications|Policy|Guidelines)/i.test(trimmedPara));

    if (isHeading) {
      currentSection = trimmedPara.replace(/[:#*]/g, '').trim();
    }

    if ((currentBuffer + '\n\n' + trimmedPara).length > maxChunkSize && currentBuffer.length > 0) {
      chunks.push({
        id: `${documentId}_chunk_${partIndex}`,
        documentId,
        documentType,
        documentTitle,
        sectionTitle: currentSection,
        pageOrPartNumber: partIndex,
        text: currentBuffer.trim(),
        tokenCount: Math.ceil(currentBuffer.length / 4),
      });
      partIndex++;

      // Retain overlap from end of previous buffer
      const overlapStart = Math.max(0, currentBuffer.length - overlap);
      currentBuffer = currentBuffer.slice(overlapStart) + '\n\n' + trimmedPara;
    } else {
      if (currentBuffer.length > 0) {
        currentBuffer += '\n\n' + trimmedPara;
      } else {
        currentBuffer = trimmedPara;
      }
    }
  }

  // Push remaining buffer
  if (currentBuffer.trim().length > 0) {
    chunks.push({
      id: `${documentId}_chunk_${partIndex}`,
      documentId,
      documentType,
      documentTitle,
      sectionTitle: currentSection,
      pageOrPartNumber: partIndex,
      text: currentBuffer.trim(),
      tokenCount: Math.ceil(currentBuffer.length / 4),
    });
  }

  return chunks;
}
