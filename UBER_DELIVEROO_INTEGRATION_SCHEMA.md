# Schema Adaptation for Uber Eats & Deliveroo Integration

## 🎯 Overview

The Sanity schemas have been completely adapted to support data import/synchronization from Uber Eats and Deliveroo APIs. The structure is now **100% modular and evolutive** to handle complex product configurations, pricing contexts, and external platform requirements.

## 🏗️ New Schema Architecture

### 📁 **New Documents Created**

#### 1. **ModifierGroup** (`modifierGroup.ts`)
**Purpose**: Handle complex customization options (sizes, add-ons, cooking instructions)

**Key Features**:
- ✅ **Selection Rules**: Min/max selections, repeatable options
- ✅ **Multiple Types**: Add ingredient, remove ingredient, size, cooking instructions, up-sell
- ✅ **Display Control**: Order, default selections, visibility
- ✅ **External Integration**: Uber Eats & Deliveroo IDs

**Example Use Cases**:
- Pizza sizes (Small, Medium, Large) with min=1, max=1
- Extra toppings with min=0, max=10, repeatable=true
- Cooking preferences (Rare, Medium, Well-done) with min=1, max=1

#### 2. **Bundle** (`bundle.ts`)
**Purpose**: Handle combo meals and bundled products

**Key Features**:
- ✅ **Flexible Items**: Required/optional items, replacement options
- ✅ **Customization Control**: Which modifiers are allowed per item
- ✅ **Bundle Pricing**: Fixed price vs individual pricing with savings
- ✅ **Availability**: Schedule-based availability, suspension
- ✅ **Promotions**: Featured bundles, limited-time offers

**Example Use Cases**:
- Big Mac Menu (burger + fries + drink)
- Pizza + Drink combo with customizable pizza
- Family meal with multiple items and choices

### 📋 **Enhanced Existing Documents**

#### 1. **Product** - Major Enhancements

##### **🆔 Identification Fields**
```typescript
plu: string                    // Product Lookup Unit for POS
barcodes: string[]            // Up to 10 barcodes
containsAlcohol: boolean      // Regulatory compliance
```

##### **💰 Advanced Pricing System**
```typescript
price: number                 // Base price
priceOverrides: [{            // Context-specific pricing
  context: 'pickup' | 'delivery' | 'dine-in' | 'modifier' | 'happy-hour' | 'lunch-special'
  price: number
  isActive: boolean
  validFrom?: datetime
  validUntil?: datetime
}]
```

##### **⚙️ Modifier Groups (Replaces Simple Extras)**
```typescript
modifierGroups: [{
  group: reference(modifierGroup)
  displayOrder: number
  isRequired: boolean
  isVisible: boolean
}]
```

##### **⏰ Advanced Availability**
```typescript
suspensionInfo: {
  isSuspended: boolean
  suspendedUntil?: datetime
  reason?: multilingualString
  hiddenFromMenu: boolean
}

availabilitySchedule: [{
  dayOfWeek: 'monday' | 'tuesday' | ... | 'all'
  startTime: string            // HH:MM format
  endTime: string             // HH:MM format
  isActive: boolean
}]
```

#### 2. **ProductExtra** - Enhanced for Complex Usage

##### **💰 Context-Aware Pricing**
```typescript
basePrice: number                    // Standard price
priceInModifierContext?: number      // Price when used as modifier
priceOverrides: [{                   // Context-specific pricing
  context: 'pickup' | 'delivery' | 'dine-in' | 'side' | 'bundle'
  price: number
}]
```

##### **📊 Quantity Constraints**
```typescript
quantityConstraints: {
  minQuantity: number         // Minimum required when selected
  maxQuantity?: number        // Maximum allowed per selection
  defaultQuantity: number     // Default when first selected
}
```

## 🔄 API Compatibility Matrix

### **Uber Eats API Compatibility**

| Uber Eats Field | Sanity Schema | Mapping |
|-----------------|---------------|---------|
| `id` | `externalIds.uberEatsId` | Direct mapping |
| `title.translations` | `title` (autoMultilingualString) | Multi-language support |
| `price_info.price` | `price` | Base price in cents → euros |
| `price_info.overrides` | `priceOverrides` | Context-based pricing |
| `modifier_group_ids` | `modifierGroups` | Reference to modifierGroup |
| `quantity_info` | `quantityConstraints` | Min/max quantity rules |
| `suspension_info` | `suspensionInfo` | Temporary suspension |
| `visibility_info` | `availabilitySchedule` | Time-based availability |
| `bundled_items` | `bundle.bundledItems` | Combo meal structure |

### **Deliveroo API Compatibility**

| Deliveroo Field | Sanity Schema | Mapping |
|-----------------|---------------|---------|
| `id` | `externalIds.deliverooId` | Direct mapping |
| `name` (multilingual) | `title` | Multi-language support |
| `price_info.overrides` | `priceOverrides` | Context pricing (pickup vs delivery) |
| `plu` | `plu` | Product lookup code |
| `barcodes` | `barcodes` | Array of product barcodes |
| `allergens` | `allergens` | Allergen information |
| `contains_alcohol` | `containsAlcohol` | Alcohol flag |
| `nutritional_info` | `nutritionalInfo` | Nutritional data |
| `type: "CHOICE"` | `modifierGroup` | Modifier as separate document |
| `type: "BUNDLE"` | `bundle` | Bundle as separate document |

## 🚀 Migration Strategy

### **Phase 1: Data Import Foundation**
1. **Create import service** for each platform
2. **Map API responses** to Sanity schemas
3. **Handle ID relationships** between products and modifiers

### **Phase 2: Real-time Synchronization**
1. **Webhook handlers** for product updates
2. **Conflict resolution** for simultaneous edits
3. **Audit logging** for all changes

### **Phase 3: Advanced Features**
1. **Price optimization** based on platform analytics
2. **Availability management** across platforms
3. **Performance monitoring** and alerts

## 📊 Data Flow Architecture

```
┌─────────────────┐    ┌───────────────┐    ┌─────────────────┐
│   Uber Eats     │    │               │    │   Your Website  │
│      API        │───▶│  Sanity CMS   │◀───│   (Next.js)     │
└─────────────────┘    │               │    └─────────────────┘
                       │   Unified     │    
┌─────────────────┐    │   Product     │    ┌─────────────────┐
│   Deliveroo     │    │   Database    │    │   Mobile App    │
│      API        │───▶│               │───▶│   (Future)      │
└─────────────────┘    └───────────────┘    └─────────────────┘
```

## 🔧 Implementation Examples

### **Example 1: Pizza with Complex Modifiers**

```typescript
// Product: Margherita Pizza
{
  title: { fr: "Pizza Margherita", en: "Margherita Pizza" },
  price: 12.50,
  priceOverrides: [
    { context: "pickup", price: 11.50 },
    { context: "delivery", price: 13.50 }
  ],
  modifierGroups: [
    {
      group: "pizza-size",           // Small, Medium, Large
      isRequired: true,
      displayOrder: 1
    },
    {
      group: "extra-toppings",       // Pepperoni, Mushrooms, etc.
      isRequired: false,
      displayOrder: 2
    },
    {
      group: "crust-type",           // Thin, Thick, Stuffed
      isRequired: true,
      displayOrder: 3
    }
  ]
}

// ModifierGroup: Pizza Size
{
  name: { fr: "Taille", en: "Size" },
  type: "size",
  selectionRules: { minSelection: 1, maxSelection: 1 },
  modifierItems: [
    { item: "small-size", isDefault: false },
    { item: "medium-size", isDefault: true },
    { item: "large-size", isDefault: false }
  ]
}
```

### **Example 2: McDonald's Style Bundle**

```typescript
// Bundle: Big Mac Menu
{
  name: { fr: "Menu Big Mac", en: "Big Mac Meal" },
  bundledItems: [
    {
      product: "big-mac",
      quantity: 1,
      isCustomizable: true,
      allowedModifierGroups: ["cooking-level", "add-remove-ingredients"]
    },
    {
      product: "french-fries",
      quantity: 1,
      isCustomizable: true,
      replacementOptions: ["onion-rings", "salad"],
      allowedModifierGroups: ["fries-size"]
    },
    {
      product: "coca-cola",
      quantity: 1,
      isOptional: false,
      replacementOptions: ["pepsi", "sprite", "water"]
    }
  ],
  pricing: {
    bundlePrice: 8.50,
    savingsAmount: 1.50
  }
}
```

## 🎯 Business Benefits

### **🔄 Unified Management**
- **Single source of truth** for all product data
- **Consistent pricing** across all platforms
- **Centralized inventory** management

### **⚡ Operational Efficiency**
- **Bulk updates** across multiple platforms
- **Automated synchronization** reduces manual work
- **Real-time availability** prevents overselling

### **📈 Analytics & Insights**
- **Cross-platform performance** comparison
- **Unified reporting** across channels
- **Data-driven decisions** for menu optimization

### **🛡️ Risk Mitigation**
- **Conflict resolution** for simultaneous edits
- **Audit trail** for all changes
- **Rollback capabilities** for problematic updates

## 🔮 Future Extensibility

### **New Platform Integration**
- **Schema extensibility**: Easy to add new external IDs
- **Pricing flexibility**: Support for any pricing model
- **Modifier adaptability**: Handle any customization system

### **Advanced Features**
- **AI-powered pricing**: Dynamic pricing based on demand
- **Inventory prediction**: Smart stock management
- **Customer preferences**: Personalized recommendations

### **API Evolution**
- **Version compatibility**: Handle API changes gracefully
- **Feature flags**: Enable/disable platform-specific features
- **A/B testing**: Test different configurations

---

## ✅ **Schema Validation Checklist**

- ✅ **Product identification**: PLU, barcodes, external IDs
- ✅ **Complex pricing**: Base price + context overrides
- ✅ **Advanced modifiers**: Groups with selection rules
- ✅ **Bundle support**: Combo meals with customization
- ✅ **Availability management**: Schedules + suspensions
- ✅ **Multilingual support**: All text fields translated
- ✅ **Nutritional compliance**: Allergens, alcohol, nutrition
- ✅ **Platform compatibility**: Uber Eats + Deliveroo ready
- ✅ **Future extensibility**: Easy to add new platforms
- ✅ **Performance optimized**: Efficient queries and relationships

**The schema is now 100% ready for Uber Eats and Deliveroo integration with maximum modularity and evolutivity!** 🚀

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>