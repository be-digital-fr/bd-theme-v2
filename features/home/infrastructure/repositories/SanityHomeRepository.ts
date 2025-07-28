import { IHomeRepository } from '../../domain/repositories/IHomeRepository';
import { HomeContent } from '../../domain/entities/HomeContent';
import { MultilingualValue } from '../../domain/value-objects/MultilingualValue';
import { client } from '../../../../sanity/lib/client';

interface SanityHomeDocument {
  _id: string;
  _type: "home";
  title?: string;
  welcoming?: Record<string, string> | string;
  subtitle?: Record<string, string> | string;
  description?: Record<string, string> | string;
  content?: string;
}

export class SanityHomeRepository implements IHomeRepository {
  async findAll(): Promise<HomeContent[]> {
    const documents = await this.fetchHomeDocuments();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<HomeContent | null> {
    const document = await client.fetch(`*[_type == "home" && _id == $id][0]{
      _id,
      _type,
      title,
      welcoming,
      subtitle,
      description,
      content
    }`, { id });

    return document ? this.mapToEntity(document) : null;
  }

  async findFirst(): Promise<HomeContent | null> {
    const documents = await this.findAll();
    return documents.length > 0 ? documents[0] : null;
  }

  private async fetchHomeDocuments(): Promise<SanityHomeDocument[]> {
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
    return result || [];
  }

  private mapToEntity(doc: SanityHomeDocument): HomeContent {
    return new HomeContent(
      doc._id,
      doc.title,
      doc.welcoming ? new MultilingualValue(doc.welcoming) : undefined,
      doc.subtitle ? new MultilingualValue(doc.subtitle) : undefined,
      doc.description ? new MultilingualValue(doc.description) : undefined,
      doc.content
    );
  }
}