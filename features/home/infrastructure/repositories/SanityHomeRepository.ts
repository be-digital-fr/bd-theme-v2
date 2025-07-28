import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContent } from '../../domain/entities/HomeContent';
import { MultilingualValue } from '../../domain/value-objects/MultilingualValue';
import { SanityHomeDocumentSchema, SanityHomeDocumentType } from '../../domain/schemas/HomeContentSchema';
import { client } from '../../../../sanity/lib/client';
import { z } from 'zod';

export class SanityHomeRepository implements IHomeRepository {
  async findAll(): Promise<HomeContent[]> {
    const documents = await this.fetchHomeDocuments();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<HomeContent | null> {
    // Validate ID input
    const validatedId = z.string().min(1).parse(id);
    
    const document = await client.fetch(`*[_type == "home" && _id == $id][0]{
      _id,
      _type,
      title,
      welcoming,
      subtitle,
      description,
      content
    }`, { id: validatedId });

    return document ? this.mapToEntity(document) : null;
  }

  async findFirst(): Promise<HomeContent | null> {
    const documents = await this.findAll();
    return documents.length > 0 ? documents[0] : null;
  }

  private async fetchHomeDocuments(): Promise<SanityHomeDocumentType[]> {
    const result = await client.fetch(`*[_type == "home"]{
      _id,
      _type,
      title,
      welcoming,
      subtitle,
      description,
      content
    }`);
    
    console.log('SanityHomeRepository - fetched documents:', result?.length || 0);
    
    // Validate and filter valid documents
    const validDocuments: SanityHomeDocumentType[] = [];
    for (const doc of (result || [])) {
      try {
        const validatedDoc = SanityHomeDocumentSchema.parse(doc);
        validDocuments.push(validatedDoc);
      } catch (error) {
        console.warn('Invalid Sanity document skipped:', doc, error);
      }
    }
    
    return validDocuments;
  }

  private mapToEntity(doc: SanityHomeDocumentType): HomeContent {
    return new HomeContent(
      doc._id,
      doc.title,
      doc.welcoming ? MultilingualValue.fromData(doc.welcoming) : undefined,
      doc.subtitle ? MultilingualValue.fromData(doc.subtitle) : undefined,
      doc.description ? MultilingualValue.fromData(doc.description) : undefined,
      doc.content
    );
  }
}