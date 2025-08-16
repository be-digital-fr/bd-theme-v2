'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SentryFormErrorCapture } from '@/lib/sentry-form-errors';
import { toast } from 'sonner';
import { AlertCircle, Bug, CheckCircle } from 'lucide-react';

/**
 * Page de test pour vérifier l'intégration Sentry dans les formulaires
 * Utile pour tester les différents types d'erreurs et leur capture
 */
export function SentryTestPage() {
  const [testData, setTestData] = useState({
    name: '',
    email: '',
    category: 'test'
  });
  const [loading, setLoading] = useState(false);

  // Test d'erreur de validation
  const testValidationError = () => {
    if (!testData.name.trim()) {
      SentryFormErrorCapture.captureValidationError([
        { field: 'name', message: 'Le nom est requis', value: testData.name },
        { field: 'email', message: 'Email invalide', value: testData.email }
      ], {
        formType: 'create',
        entityType: 'product',
        formData: testData
      });
      
      toast.error('Erreurs de validation détectées');
      return;
    }
    
    toast.success('Validation réussie - erreur de validation envoyée à Sentry');
  };

  // Test d'erreur réseau simulée
  const testNetworkError = async () => {
    setLoading(true);
    
    try {
      // Simuler une erreur réseau
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Network request failed'));
        }, 1000);
      });
    } catch (error) {
      SentryFormErrorCapture.captureFormError(error as Error, {
        formType: 'create',
        entityType: 'product',
        formData: testData
      });
      
      toast.error('Erreur réseau simulée et envoyée à Sentry');
    } finally {
      setLoading(false);
    }
  };

  // Test d'erreur de base de données simulée
  const testDatabaseError = () => {
    const dbError = new Error('Prisma Client validation error: Unique constraint failed on the fields: (name)');
    
    SentryFormErrorCapture.captureFormError(dbError, {
      formType: 'create',
      entityType: 'category',
      formData: testData
    });
    
    toast.error('Erreur de base de données simulée et envoyée à Sentry');
  };

  // Test de succès
  const testSuccessCapture = () => {
    const startTime = Date.now();
    
    setTimeout(() => {
      const duration = Date.now() - startTime;
      
      SentryFormErrorCapture.captureFormSuccess({
        formType: 'create',
        entityType: 'product'
      }, duration);
      
      toast.success('Succès simulé et envoyé à Sentry pour monitoring');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Test d'intégration Sentry</h1>
        <p className="text-muted-foreground mt-2">
          Testez la capture d'erreurs Sentry dans les formulaires CRUD
        </p>
      </div>

      <Alert>
        <Bug className="h-4 w-4" />
        <AlertDescription>
          Cette page permet de tester l'intégration Sentry en simulant différents types d'erreurs.
          Vérifiez votre dashboard Sentry pour voir les erreurs capturées.
        </AlertDescription>
      </Alert>

      {/* Formulaire de test */}
      <Card>
        <CardHeader>
          <CardTitle>Formulaire de test</CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour tester la validation et les erreurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={testData.name}
              onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Entrez un nom pour éviter l'erreur de validation"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={testData.email}
              onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="test@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tests d'erreurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Tests d'erreurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testValidationError}
              variant="destructive"
              className="w-full"
            >
              Test erreur de validation
            </Button>
            
            <Button 
              onClick={testNetworkError}
              variant="destructive"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Test en cours...' : 'Test erreur réseau'}
            </Button>
            
            <Button 
              onClick={testDatabaseError}
              variant="destructive"
              className="w-full"
            >
              Test erreur base de données
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Test de succès
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testSuccessCapture}
              variant="default"
              className="w-full"
            >
              Test succès (monitoring)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur la configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Sentry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Environnement:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>Sentry DSN configuré:</strong> {process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Oui' : 'Non'}
            </div>
            <div>
              <strong>Sentry activé:</strong> {process.env.NEXT_PUBLIC_ENABLE_SENTRY !== 'false' ? 'Oui' : 'Non'}
            </div>
            <div>
              <strong>Debug mode:</strong> {process.env.NODE_ENV === 'development' ? 'Oui' : 'Non'}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded">
            <p className="text-xs">
              <strong>Note:</strong> Les erreurs sont capturées avec des tags et contextes spécifiques 
              pour faciliter le debugging et le monitoring. Chaque type d'erreur (validation, réseau, 
              base de données) est catégorisé différemment dans Sentry.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}