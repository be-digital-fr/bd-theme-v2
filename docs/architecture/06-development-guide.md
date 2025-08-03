# Guide de Développement

## Vue d'ensemble

Ce guide vous accompagne dans l'ajout de nouvelles fonctionnalités à Be Digital en respectant les principes de Clean Architecture. Suivez ces étapes pour maintenir la cohérence architecturale.

## 🚀 Créer une Nouvelle Feature

### Étape 1 : Planification

Avant de commencer, répondez à ces questions :

- **Quel est le domaine métier ?** (ex: commandes, produits, paiements)
- **Quelles sont les entités principales ?** (ex: Order, Product, Payment)
- **Quels sont les cas d'usage ?** (ex: CreateOrder, UpdateProduct, ProcessPayment)
- **Quelles sont les dépendances externes ?** (ex: base de données, API, services)

### Étape 2 : Créer la Structure

```bash
# Créer la structure de dossiers
mkdir -p features/[feature-name]/{domain/{entities,schemas,repositories,services},application/use-cases,infrastructure/{repositories,services,di},presentation/hooks}

# Exemple pour une feature "order"
mkdir -p features/order/{domain/{entities,schemas,repositories,services},application/use-cases,infrastructure/{repositories,services,di},presentation/hooks}
```

### Étape 3 : Implémenter le Domain Layer

#### 3.1 Créer l'Entité Principale

```typescript
// features/order/domain/entities/Order.ts
export class Order {
  private constructor(
    public readonly id: string,
    private _customerId: string,
    private _items: OrderItem[],
    private _status: OrderStatus,
    private _totalAmount: number,
    private _createdAt: Date = new Date()
  ) {}

  static create(data: CreateOrderData): Order {
    // Validation métier
    if (!data.customerId) {
      throw new Error('Customer ID is required');
    }

    if (data.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    // Calcul du montant total
    const totalAmount = data.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    return new Order(
      generateId(),
      data.customerId,
      data.items.map(item => OrderItem.create(item)),
      OrderStatus.PENDING,
      totalAmount
    );
  }

  static fromPersistence(data: OrderPersistenceData): Order {
    return new Order(
      data.id,
      data.customerId,
      data.items.map(item => OrderItem.fromPersistence(item)),
      data.status as OrderStatus,
      data.totalAmount,
      new Date(data.createdAt)
    );
  }

  // Getters
  get customerId(): string {
    return this._customerId;
  }

  get items(): readonly OrderItem[] {
    return [...this._items];
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Business methods
  confirm(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be confirmed');
    }
    
    this._status = OrderStatus.CONFIRMED;
  }

  cancel(): void {
    if (this._status === OrderStatus.DELIVERED || 
        this._status === OrderStatus.CANCELLED) {
      throw new Error('Cannot cancel completed or already cancelled order');
    }
    
    this._status = OrderStatus.CANCELLED;
  }

  addItem(item: OrderItem): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot modify confirmed order');
    }
    
    this._items.push(item);
    this._totalAmount += item.price * item.quantity;
  }

  removeItem(itemId: string): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new Error('Cannot modify confirmed order');
    }
    
    const itemIndex = this._items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found in order');
    }
    
    const removedItem = this._items[itemIndex];
    this._items.splice(itemIndex, 1);
    this._totalAmount -= removedItem.price * removedItem.quantity;
  }

  // Helper methods
  isModifiable(): boolean {
    return this._status === OrderStatus.PENDING;
  }

  isCompleted(): boolean {
    return this._status === OrderStatus.DELIVERED || 
           this._status === OrderStatus.CANCELLED;
  }
}

// Énumérations et types
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateOrderData {
  customerId: string;
  items: CreateOrderItemData[];
}

export interface CreateOrderItemData {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
```

#### 3.2 Créer les Schémas de Validation

```typescript
// features/order/domain/schemas/OrderSchemas.ts
import { z } from 'zod';

export const CreateOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be a positive integer')
});

export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  items: z.array(CreateOrderItemSchema).min(1, 'At least one item is required')
});

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: 'Invalid order status' })
  })
});

export const OrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  subtotal: z.number()
});

export const OrderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  items: z.array(OrderItemSchema),
  status: z.nativeEnum(OrderStatus),
  totalAmount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().optional()
});

// Types TypeScript dérivés
export type CreateOrderData = z.infer<typeof CreateOrderSchema>;
export type CreateOrderItemData = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderStatusData = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderData = z.infer<typeof OrderSchema>;
export type OrderItemData = z.infer<typeof OrderItemSchema>;
```

#### 3.3 Créer les Interfaces

```typescript
// features/order/domain/repositories/IOrderRepository.ts
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  save(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  findAll(filters?: OrderFilters): Promise<Order[]>;
}

export interface OrderFilters {
  customerId?: string;
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

// features/order/domain/services/INotificationService.ts
export interface INotificationService {
  sendOrderConfirmation(order: Order, customerEmail: string): Promise<void>;
  sendOrderStatusUpdate(order: Order, customerEmail: string): Promise<void>;
  sendOrderCancellation(order: Order, customerEmail: string): Promise<void>;
}

// features/order/domain/services/IPaymentService.ts
export interface IPaymentService {
  processPayment(order: Order, paymentMethod: PaymentMethod): Promise<PaymentResult>;
  refundPayment(orderId: string, amount: number): Promise<RefundResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}
```

### Étape 4 : Implémenter l'Application Layer

#### 4.1 Créer les Use Cases

```typescript
// features/order/application/use-cases/CreateOrderUseCase.ts
export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private notificationService: INotificationService,
    private paymentService: IPaymentService
  ) {}

  async execute(data: CreateOrderData): Promise<Result<Order, CreateOrderError>> {
    try {
      // 1. Validation des données
      const validatedData = CreateOrderSchema.parse(data);

      // 2. Création de l'entité Order
      const order = Order.create(validatedData);

      // 3. Vérification de la disponibilité des produits (logique métier)
      for (const item of order.items) {
        // Cette logique pourrait être dans un autre service
        // await this.productService.checkAvailability(item.productId, item.quantity);
      }

      // 4. Sauvegarde de la commande
      const savedOrder = await this.orderRepository.save(order);

      // 5. Traitement du paiement (si nécessaire)
      if (data.paymentMethod) {
        const paymentResult = await this.paymentService.processPayment(
          savedOrder, 
          data.paymentMethod
        );
        
        if (!paymentResult.success) {
          // Annuler la commande si le paiement échoue
          savedOrder.cancel();
          await this.orderRepository.save(savedOrder);
          
          return { 
            success: false, 
            error: 'Payment processing failed: ' + paymentResult.error 
          };
        }
      }

      // 6. Notification client
      await this.notificationService.sendOrderConfirmation(
        savedOrder, 
        data.customerEmail
      );

      return { success: true, data: savedOrder };

    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          success: false, 
          error: 'Validation error: ' + error.errors.map(e => e.message).join(', ')
        };
      }

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// features/order/application/use-cases/UpdateOrderStatusUseCase.ts
export class UpdateOrderStatusUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private notificationService: INotificationService
  ) {}

  async execute(data: UpdateOrderStatusData): Promise<Result<Order, UpdateOrderError>> {
    try {
      // 1. Validation
      const validatedData = UpdateOrderStatusSchema.parse(data);

      // 2. Récupération de la commande
      const order = await this.orderRepository.findById(validatedData.orderId);
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      // 3. Mise à jour du statut (logique métier dans l'entité)
      const oldStatus = order.status;
      
      try {
        switch (validatedData.status) {
          case OrderStatus.CONFIRMED:
            order.confirm();
            break;
          case OrderStatus.CANCELLED:
            order.cancel();
            break;
          default:
            // Pour les autres statuts, mise à jour directe
            // (cette logique pourrait être plus complexe selon les règles métier)
            order.updateStatus(validatedData.status);
        }
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Status update failed'
        };
      }

      // 4. Sauvegarde
      const updatedOrder = await this.orderRepository.save(order);

      // 5. Notification si le statut a changé
      if (oldStatus !== updatedOrder.status) {
        await this.notificationService.sendOrderStatusUpdate(
          updatedOrder,
          data.customerEmail // Ceci devrait venir de la commande ou être récupéré
        );
      }

      return { success: true, data: updatedOrder };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// features/order/application/use-cases/GetOrdersUseCase.ts
export class GetOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(filters: OrderFilters = {}): Promise<Result<Order[], GetOrdersError>> {
    try {
      const orders = await this.orderRepository.findAll(filters);
      return { success: true, data: orders };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get orders'
      };
    }
  }
}
```

### Étape 5 : Implémenter l'Infrastructure Layer

#### 5.1 Créer les Repositories

```typescript
// features/order/infrastructure/repositories/PrismaOrderRepository.ts
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Order | null> {
    const orderData = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });

    return orderData ? Order.fromPersistence(orderData) : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const ordersData = await this.prisma.order.findMany({
      where: { customerId },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return ordersData.map(order => Order.fromPersistence(order));
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    const ordersData = await this.prisma.order.findMany({
      where: { status },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return ordersData.map(order => Order.fromPersistence(order));
  }

  async save(order: Order): Promise<Order> {
    const orderData = {
      id: order.id,
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: {
        upsert: order.items.map(item => ({
          where: { id: item.id },
          create: {
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          },
          update: {
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }
        }))
      }
    };

    const savedOrder = await this.prisma.order.upsert({
      where: { id: order.id },
      create: orderData,
      update: orderData,
      include: {
        items: true
      }
    });

    return Order.fromPersistence(savedOrder);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id }
    });
  }

  async findAll(filters: OrderFilters = {}): Promise<Order[]> {
    const where: any = {};

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    const ordersData = await this.prisma.order.findMany({
      where,
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: filters.limit,
      skip: filters.offset
    });

    return ordersData.map(order => Order.fromPersistence(order));
  }
}
```

#### 5.2 Créer les Services

```typescript
// features/order/infrastructure/services/EmailNotificationService.ts
export class EmailNotificationService implements INotificationService {
  constructor(private emailService: IEmailService) {}

  async sendOrderConfirmation(order: Order, customerEmail: string): Promise<void> {
    const subject = `Confirmation de commande #${order.id}`;
    const html = this.generateOrderConfirmationHtml(order);

    await this.emailService.send({
      to: customerEmail,
      subject,
      html
    });
  }

  async sendOrderStatusUpdate(order: Order, customerEmail: string): Promise<void> {
    const subject = `Mise à jour de votre commande #${order.id}`;
    const html = this.generateOrderStatusUpdateHtml(order);

    await this.emailService.send({
      to: customerEmail,
      subject,
      html
    });
  }

  async sendOrderCancellation(order: Order, customerEmail: string): Promise<void> {
    const subject = `Annulation de votre commande #${order.id}`;
    const html = this.generateOrderCancellationHtml(order);

    await this.emailService.send({
      to: customerEmail,
      subject,
      html
    });
  }

  private generateOrderConfirmationHtml(order: Order): string {
    // Template HTML pour la confirmation de commande
    return `
      <h1>Merci pour votre commande !</h1>
      <p>Votre commande #${order.id} a été confirmée.</p>
      <h2>Détails de la commande:</h2>
      <ul>
        ${order.items.map(item => `
          <li>${item.name} x${item.quantity} - ${item.price * item.quantity}€</li>
        `).join('')}
      </ul>
      <p><strong>Total: ${order.totalAmount}€</strong></p>
      <p>Statut: ${order.status}</p>
    `;
  }

  private generateOrderStatusUpdateHtml(order: Order): string {
    // Template HTML pour la mise à jour de statut
    return `
      <h1>Mise à jour de votre commande</h1>
      <p>Votre commande #${order.id} est maintenant : <strong>${order.status}</strong></p>
      ${this.getStatusMessage(order.status)}
    `;
  }

  private generateOrderCancellationHtml(order: Order): string {
    // Template HTML pour l'annulation
    return `
      <h1>Commande annulée</h1>
      <p>Votre commande #${order.id} a été annulée.</p>
      <p>Si vous avez effectué un paiement, il sera remboursé sous 3-5 jours ouvrables.</p>
    `;
  }

  private getStatusMessage(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return '<p>Votre commande est confirmée et va être préparée.</p>';
      case OrderStatus.PREPARING:
        return '<p>Votre commande est en cours de préparation.</p>';
      case OrderStatus.READY:
        return '<p>Votre commande est prête ! Vous pouvez venir la récupérer.</p>';
      case OrderStatus.DELIVERED:
        return '<p>Votre commande a été livrée. Merci pour votre confiance !</p>';
      case OrderStatus.CANCELLED:
        return '<p>Votre commande a été annulée.</p>';
      default:
        return '';
    }
  }
}

// features/order/infrastructure/services/StripePaymentService.ts
export class StripePaymentService implements IPaymentService {
  constructor(private stripe: Stripe) {}

  async processPayment(order: Order, paymentMethod: PaymentMethod): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Stripe uses cents
        currency: 'eur',
        payment_method: paymentMethod.stripePaymentMethodId,
        confirm: true,
        metadata: {
          orderId: order.id,
          customerId: order.customerId
        }
      });

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentId: paymentIntent.id,
          amount: order.totalAmount,
          status: 'completed'
        };
      } else {
        return {
          success: false,
          error: `Payment failed with status: ${paymentIntent.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  async refundPayment(orderId: string, amount: number): Promise<RefundResult> {
    try {
      // Trouver le payment intent via les métadonnées
      const paymentIntents = await this.stripe.paymentIntents.list({
        limit: 100 // En production, implémenter une recherche plus robuste
      });

      const paymentIntent = paymentIntents.data.find(
        pi => pi.metadata.orderId === orderId
      );

      if (!paymentIntent) {
        return {
          success: false,
          error: 'Payment not found for this order'
        };
      }

      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntent.id,
        amount: Math.round(amount * 100)
      });

      return {
        success: true,
        refundId: refund.id,
        amount: amount,
        status: refund.status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency
      };
    } catch (error) {
      throw new Error(`Failed to get payment status: ${error}`);
    }
  }
}
```

#### 5.3 Créer le Container DI

```typescript
// features/order/infrastructure/di/OrderContainer.ts
export class OrderContainer {
  private static instance: OrderContainer;
  
  private constructor() {}

  static getInstance(): OrderContainer {
    if (!OrderContainer.instance) {
      OrderContainer.instance = new OrderContainer();
    }
    return OrderContainer.instance;
  }

  // Repositories
  get orderRepository(): IOrderRepository {
    if (process.env.NODE_ENV === 'test') {
      return new MockOrderRepository();
    }
    return new PrismaOrderRepository(prisma);
  }

  // Services
  get notificationService(): INotificationService {
    return new EmailNotificationService(this.emailService);
  }

  get paymentService(): IPaymentService {
    if (process.env.PAYMENT_PROVIDER === 'stripe') {
      return new StripePaymentService(stripe);
    }
    return new MockPaymentService(); // Pour les tests
  }

  private get emailService(): IEmailService {
    if (process.env.NODE_ENV === 'development') {
      return new ConsoleEmailService();
    }
    return new ResendEmailService(process.env.RESEND_API_KEY!);
  }

  // Use Cases
  get createOrderUseCase(): CreateOrderUseCase {
    return new CreateOrderUseCase(
      this.orderRepository,
      this.notificationService,
      this.paymentService
    );
  }

  get updateOrderStatusUseCase(): UpdateOrderStatusUseCase {
    return new UpdateOrderStatusUseCase(
      this.orderRepository,
      this.notificationService
    );
  }

  get getOrdersUseCase(): GetOrdersUseCase {
    return new GetOrdersUseCase(this.orderRepository);
  }

  get getOrderByIdUseCase(): GetOrderByIdUseCase {
    return new GetOrderByIdUseCase(this.orderRepository);
  }

  get cancelOrderUseCase(): CancelOrderUseCase {
    return new CancelOrderUseCase(
      this.orderRepository,
      this.paymentService,
      this.notificationService
    );
  }
}

// Export du container global
export const orderContainer = OrderContainer.getInstance();
```

### Étape 6 : Implémenter la Presentation Layer

#### 6.1 Créer les Hooks

```typescript
// features/order/presentation/hooks/useCreateOrder.ts
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const result = await orderContainer.createOrderUseCase.execute(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: (order) => {
      // Invalider le cache des commandes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Ajouter la nouvelle commande au cache
      queryClient.setQueryData(['order', order.id], order);
      
      // Notification de succès
      toast.success(`Commande #${order.id} créée avec succès !`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    }
  });
}

// features/order/presentation/hooks/useOrders.ts
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const result = await orderContainer.getOrdersUseCase.execute(filters);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000 // Refetch toutes les minutes
  });
}

// features/order/presentation/hooks/useOrder.ts
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const result = await orderContainer.getOrderByIdUseCase.execute(orderId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    enabled: !!orderId,
    staleTime: 60 * 1000 // 1 minute
  });
}

// features/order/presentation/hooks/useUpdateOrderStatus.ts
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateOrderStatusData) => {
      const result = await orderContainer.updateOrderStatusUseCase.execute(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: (updatedOrder) => {
      // Mettre à jour le cache de la commande spécifique
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
      
      // Invalider la liste des commandes pour refléter le changement
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(`Statut mis à jour: ${updatedOrder.status}`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  });
}

// features/order/presentation/hooks/useCancelOrder.ts
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const result = await orderContainer.cancelOrderUseCase.execute(orderId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: (cancelledOrder) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['order', cancelledOrder.id], cancelledOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(`Commande #${cancelledOrder.id} annulée`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'annulation: ${error.message}`);
    }
  });
}
```

### Étape 7 : Utilisation dans les Composants

```typescript
// components/orders/OrderForm.tsx
export function OrderForm() {
  const { createOrder, isLoading, error } = useCreateOrder();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateOrderFormData>({
    resolver: zodResolver(CreateOrderFormSchema)
  });

  const onSubmit = async (data: CreateOrderFormData) => {
    await createOrder(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('customerId')}
        placeholder="ID Client"
        disabled={isLoading}
      />
      {errors.customerId && <span>{errors.customerId.message}</span>}
      
      {/* Champs pour les items de commande */}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer la commande'}
      </button>
      
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}

// components/orders/OrdersList.tsx
export function OrdersList({ customerId }: { customerId?: string }) {
  const { data: orders, isLoading, error, refetch } = useOrders({ 
    customerId 
  });
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus();
  const { cancelOrder, isCancelling } = useCancelOrder();

  if (isLoading) return <OrdersListSkeleton />;
  if (error) return <div>Erreur: {error.message}</div>;

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus({ orderId, status });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      await cancelOrder(orderId);
    }
  };

  return (
    <div>
      <div className="header">
        <h2>Commandes ({orders?.length || 0})</h2>
        <button onClick={() => refetch()}>Actualiser</button>
      </div>
      
      {orders?.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Commande #{order.id}</h3>
            <span className={`status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
          
          <div className="order-details">
            <p>Client: {order.customerId}</p>
            <p>Total: {order.totalAmount}€</p>
            <p>Date: {order.createdAt.toLocaleDateString()}</p>
          </div>
          
          <div className="order-items">
            <h4>Articles:</h4>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.name} x{item.quantity} - {item.price * item.quantity}€
                </li>
              ))}
            </ul>
          </div>
          
          <div className="order-actions">
            {order.isModifiable() && (
              <>
                <button
                  onClick={() => handleStatusUpdate(order.id, OrderStatus.CONFIRMED)}
                  disabled={isUpdating}
                >
                  Confirmer
                </button>
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={isCancelling}
                  className="danger"
                >
                  Annuler
                </button>
              </>
            )}
            
            {order.status === OrderStatus.CONFIRMED && (
              <button
                onClick={() => handleStatusUpdate(order.id, OrderStatus.PREPARING)}
                disabled={isUpdating}
              >
                Marquer en préparation
              </button>
            )}
            
            {order.status === OrderStatus.PREPARING && (
              <button
                onClick={() => handleStatusUpdate(order.id, OrderStatus.READY)}
                disabled={isUpdating}
              >
                Marquer prêt
              </button>
            )}
            
            {order.status === OrderStatus.READY && (
              <button
                onClick={() => handleStatusUpdate(order.id, OrderStatus.DELIVERED)}
                disabled={isUpdating}
              >
                Marquer livré
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🧪 Tests

### Tests d'Entité
```typescript
// tests/features/order/domain/Order.test.ts
describe('Order Entity', () => {
  describe('create', () => {
    it('should create a valid order', () => {
      const orderData = {
        customerId: 'customer-123',
        items: [
          { productId: 'product-1', name: 'Pizza', price: 12.99, quantity: 2 }
        ]
      };
      
      const order = Order.create(orderData);
      
      expect(order.customerId).toBe('customer-123');
      expect(order.items).toHaveLength(1);
      expect(order.totalAmount).toBe(25.98);
      expect(order.status).toBe(OrderStatus.PENDING);
    });
    
    it('should throw error for empty items', () => {
      const orderData = {
        customerId: 'customer-123',
        items: []
      };
      
      expect(() => Order.create(orderData)).toThrow('Order must have at least one item');
    });
  });
  
  describe('business methods', () => {
    let order: Order;
    
    beforeEach(() => {
      order = Order.create({
        customerId: 'customer-123',
        items: [
          { productId: 'product-1', name: 'Pizza', price: 12.99, quantity: 1 }
        ]
      });
    });
    
    it('should confirm pending order', () => {
      order.confirm();
      expect(order.status).toBe(OrderStatus.CONFIRMED);
    });
    
    it('should not confirm already confirmed order', () => {
      order.confirm();
      expect(() => order.confirm()).toThrow('Only pending orders can be confirmed');
    });
  });
});
```

### Tests de Use Case
```typescript
// tests/features/order/application/CreateOrderUseCase.test.ts
describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockNotificationService: jest.Mocked<INotificationService>;
  let mockPaymentService: jest.Mocked<IPaymentService>;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn()
    } as any;
    
    mockNotificationService = {
      sendOrderConfirmation: jest.fn()
    } as any;
    
    mockPaymentService = {
      processPayment: jest.fn()
    } as any;
    
    useCase = new CreateOrderUseCase(
      mockOrderRepository,
      mockNotificationService,
      mockPaymentService
    );
  });

  it('should create order successfully', async () => {
    const testOrder = Order.create({
      customerId: 'customer-123',
      items: [
        { productId: 'product-1', name: 'Pizza', price: 12.99, quantity: 1 }
      ]
    });
    
    mockOrderRepository.save.mockResolvedValue(testOrder);
    mockNotificationService.sendOrderConfirmation.mockResolvedValue();

    const result = await useCase.execute({
      customerId: 'customer-123',
      customerEmail: 'test@example.com',
      items: [
        { productId: 'product-1', name: 'Pizza', price: 12.99, quantity: 1 }
      ]
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(testOrder);
    expect(mockOrderRepository.save).toHaveBeenCalledWith(expect.any(Order));
    expect(mockNotificationService.sendOrderConfirmation).toHaveBeenCalledWith(
      testOrder,
      'test@example.com'
    );
  });
});
```

---

## 📋 Checklist de Validation

### ✅ Domain Layer
- [ ] Entités créées avec validation métier
- [ ] Schémas Zod pour validation des données
- [ ] Interfaces de repositories définies
- [ ] Interfaces de services définies (si nécessaire)
- [ ] Aucune dépendance externe dans le domain

### ✅ Application Layer
- [ ] Use cases implémentés pour chaque action métier
- [ ] Gestion d'erreurs avec pattern Either
- [ ] Validation des entrées avec Zod
- [ ] Orchestration correcte des dépendances

### ✅ Infrastructure Layer
- [ ] Repositories implémentés pour la persistance
- [ ] Services implémentés pour les dépendances externes
- [ ] Container DI configuré
- [ ] Configuration par environnement

### ✅ Presentation Layer
- [ ] Hooks React créés pour l'interface
- [ ] Intégration React Query pour le cache
- [ ] Gestion des états de chargement et erreurs
- [ ] Optimistic updates si approprié

### ✅ Tests
- [ ] Tests unitaires des entités
- [ ] Tests unitaires des use cases
- [ ] Tests d'intégration des repositories
- [ ] Tests des hooks React

### ✅ Documentation
- [ ] Mise à jour de cette documentation
- [ ] Exemples d'usage ajoutés
- [ ] Diagrammes mis à jour si nécessaire

---

**Previous:** [← Features Implémentées](./05-features-guide.md) | **Next:** [Exemples Pratiques](./07-examples.md) →