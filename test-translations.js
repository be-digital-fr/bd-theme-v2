// Script simple pour tester les traductions
async function testTranslations() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/translations?category=auth');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ API de traductions accessible');
    console.log('📊 Traductions trouvées:', Object.keys(data.translations || {}).length);
    
    // Tester quelques traductions spécifiques
    const testKeys = [
      'auth.signin.title',
      'auth.signin.subtitle', 
      'auth.signup.title'
    ];
    
    for (const key of testKeys) {
      if (data.translations?.[key]) {
        console.log(`✅ ${key}:`, data.translations[key].fr);
      } else {
        console.log(`❌ ${key}: Manquant`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test des traductions:', error.message);
    return false;
  }
}

// Exporter pour utilisation en test
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testTranslations };
}

// Exécution directe si c'est le script principal
if (typeof window === 'undefined' && require.main === module) {
  testTranslations();
}