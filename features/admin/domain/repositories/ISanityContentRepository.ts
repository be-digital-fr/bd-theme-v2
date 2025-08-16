export interface SanityDocument {
  _id: string;
  _type: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
  [key: string]: any;
}

export interface SanityMutationResult {
  documentId: string;
  document: SanityDocument;
}

export interface AuthResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Repository interface pour la gestion des documents Sanity
 */
export interface ISanityContentRepository {
  /**
   * Récupère un document par son type et ID
   */
  getDocument(type: string, id?: string): Promise<AuthResult<SanityDocument | null>>;
  
  /**
   * Met à jour un document existant
   */
  updateDocument(type: string, id: string, data: Partial<SanityDocument>): Promise<AuthResult<SanityDocument>>;
  
  /**
   * Crée un nouveau document
   */
  createDocument(type: string, data: Omit<SanityDocument, '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt'>): Promise<AuthResult<SanityDocument>>;
  
  /**
   * Crée ou met à jour un document singleton
   */
  createOrUpdateSingleton(type: string, data: any): Promise<AuthResult<SanityDocument>>;
  
  /**
   * Supprime un document
   */
  deleteDocument(id: string): Promise<AuthResult<void>>;
  
  /**
   * Récupère tous les documents d'un type
   */
  getDocumentsByType(type: string): Promise<AuthResult<SanityDocument[]>>;
}