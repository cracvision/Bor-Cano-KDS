import { Order, OrderStatus, OrderSource, OrderPriority } from './types';

export const STATUS_CONFIG: Record<OrderStatus, { title: string; color: string; nextStatus?: OrderStatus }> = {
    [OrderStatus.NEW]: { title: 'Nuevo', color: 'bg-blue-600', nextStatus: OrderStatus.ACK },
    [OrderStatus.ACK]: { title: 'Confirmado', color: 'bg-yellow-600', nextStatus: OrderStatus.IN_PREP },
    [OrderStatus.IN_PREP]: { title: 'En Preparación', color: 'bg-orange-600', nextStatus: OrderStatus.READY },
    [OrderStatus.READY]: { title: 'Listo', color: 'bg-green-600', nextStatus: OrderStatus.SERVED },
    [OrderStatus.SERVED]: { title: 'Servido', color: 'bg-violet-600', nextStatus: OrderStatus.ARCHIVED },
    [OrderStatus.CANCELED]: { title: 'Cancelado', color: 'bg-red-800' },
    [OrderStatus.ARCHIVED]: { title: 'Archivado', color: 'bg-gray-700' },
};

export const KDS_COLUMNS: OrderStatus[] = [
    OrderStatus.NEW,
    OrderStatus.ACK,
    OrderStatus.IN_PREP,
    OrderStatus.READY,
    OrderStatus.SERVED
];

// SLA thresholds in seconds
export const SLA_THRESHOLDS: Record<OrderStatus, { warn: number; critical: number }> = {
    [OrderStatus.NEW]: { warn: 45, critical: 60 }, // 1 min
    [OrderStatus.ACK]: { warn: 120, critical: 180 }, // 3 min
    [OrderStatus.IN_PREP]: { warn: 600, critical: 900 }, // 15 min
    [OrderStatus.READY]: { warn: 180, critical: 300 }, // 5 min
    [OrderStatus.SERVED]: { warn: Infinity, critical: Infinity }, // No SLA
    [OrderStatus.CANCELED]: { warn: Infinity, critical: Infinity },
    [OrderStatus.ARCHIVED]: { warn: Infinity, critical: Infinity },
};

export const BOARD_ALLOWED_TRANSITIONS = new Map<OrderStatus, OrderStatus[]>([
    [OrderStatus.NEW, [OrderStatus.ACK, OrderStatus.CANCELED]],
    [OrderStatus.ACK, [OrderStatus.NEW, OrderStatus.IN_PREP, OrderStatus.CANCELED]],
    [OrderStatus.IN_PREP, [OrderStatus.ACK, OrderStatus.READY, OrderStatus.CANCELED]],
    [OrderStatus.READY, [OrderStatus.IN_PREP, OrderStatus.SERVED, OrderStatus.CANCELED]],
    [OrderStatus.SERVED, [OrderStatus.READY, OrderStatus.ARCHIVED, OrderStatus.CANCELED]],
]);


const now = new Date();
const subtractMinutes = (date: Date, minutes: number) => new Date(date.getTime() - minutes * 60000);
const subtractDays = (date: Date, days: number) => new Date(date.getTime() - days * 24 * 60 * 60000);

const generateArchivedOrders = (count: number): Order[] => {
    const orders: Order[] = [];
    for (let i = 0; i < count; i++) {
        const isCanceled = i % 10 === 0;
        const status = isCanceled ? OrderStatus.CANCELED : OrderStatus.ARCHIVED;
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const createdAt = subtractDays(now, daysAgo);
        const updatedAt = new Date(createdAt.getTime() + Math.random() * 60 * 60000 * 2); // updated up to 2 hours later
        const source = [OrderSource.WEB, OrderSource.WHATSAPP, OrderSource.VOICE][i % 3];

        orders.push({
            order_id: `ARC-${source[0].toUpperCase()}-${Math.random().toString(16).substr(2, 4).toUpperCase()}`,
            source,
            status,
            priority: [OrderPriority.NORMAL, OrderPriority.HIGH][i % 2],
            created_at: createdAt.toISOString(),
            updated_at: updatedAt.toISOString(),
            table_number: `Mesa ${i + 20}`,
            customer_name: ['Histórico 1', 'Histórico 2', 'Cliente Pasado'][i % 3],
            items: [{ name: 'Plato Archivado', qty: 1 }],
            allergies: i % 7 === 0 ? ['Maní'] : [],
            notes: isCanceled ? 'Cancelado por el cliente.' : null,
            status_history: [
                { status: OrderStatus.NEW, at: createdAt.toISOString(), by: 'System' },
                { status, at: updatedAt.toISOString(), by: isCanceled ? 'Jefe' : 'System' }
            ],
        });
    }
    return orders;
};


export const initialOrders: Order[] = [
    // NEW Orders
    {
        order_id: 'W-8B3C',
        source: OrderSource.WHATSAPP,
        status: OrderStatus.NEW,
        priority: OrderPriority.HIGH,
        created_at: subtractMinutes(now, 1.1).toISOString(),
        updated_at: subtractMinutes(now, 1.1).toISOString(),
        table_number: 'Mesa 5',
        customer_name: 'Ana Gómez',
        items: [{ name: 'Mofongo Relleno', qty: 1, notes: 'Extra ajo' }, { name: 'Piña Colada', qty: 2 }],
        allergies: ['Maní'],
        notes: 'Cliente con prisa.',
        status_history: [{ status: OrderStatus.NEW, at: subtractMinutes(now, 1.1).toISOString(), by: 'System' }],
    },
    {
        order_id: 'V-A2D1',
        source: OrderSource.VOICE,
        status: OrderStatus.NEW,
        priority: OrderPriority.NORMAL,
        created_at: subtractMinutes(now, 0.5).toISOString(),
        updated_at: subtractMinutes(now, 0.5).toISOString(),
        table_number: null,
        customer_name: 'Carlos R.',
        items: [{ name: 'Tostones', qty: 1 }],
        allergies: [],
        notes: null,
        status_history: [{ status: OrderStatus.NEW, at: subtractMinutes(now, 0.5).toISOString(), by: 'System' }],
    },

    // ACK Orders
    {
        order_id: 'H-F4E5',
        source: OrderSource.WEB,
        status: OrderStatus.ACK,
        priority: OrderPriority.NORMAL,
        created_at: subtractMinutes(now, 4).toISOString(),
        updated_at: subtractMinutes(now, 2.5).toISOString(),
        table_number: 'Mesa 12',
        customer_name: null,
        items: [{ name: 'Asopao de Pollo', qty: 2 }, { name: 'Agua de Coco', qty: 2, notes: 'Fría por favor' }],
        allergies: [],
        notes: null,
        status_history: [
            { status: OrderStatus.NEW, at: subtractMinutes(now, 4).toISOString(), by: 'System' },
            { status: OrderStatus.ACK, at: subtractMinutes(now, 2.5).toISOString(), by: 'Jefe' }
        ],
    },
    {
        order_id: 'W-9C4B',
        source: OrderSource.WHATSAPP,
        status: OrderStatus.ACK,
        priority: OrderPriority.NORMAL,
        created_at: subtractMinutes(now, 3).toISOString(),
        updated_at: subtractMinutes(now, 1).toISOString(),
        table_number: 'Para llevar',
        customer_name: 'Luisa F.',
        items: [{ name: 'Ensalada de Pulpo', qty: 1 }],
        allergies: ['Gluten'],
        notes: 'Empacar para viaje largo.',
        status_history: [
            { status: OrderStatus.NEW, at: subtractMinutes(now, 3).toISOString(), by: 'System' },
            { status: OrderStatus.ACK, at: subtractMinutes(now, 1).toISOString(), by: 'Cocinero' }
        ],
    },

    // IN_PREP Orders
    {
        order_id: 'V-1G8H',
        source: OrderSource.VOICE,
        status: OrderStatus.IN_PREP,
        priority: OrderPriority.HIGH,
        created_at: subtractMinutes(now, 18).toISOString(),
        updated_at: subtractMinutes(now, 12).toISOString(),
        table_number: 'Mesa 2',
        customer_name: 'Familia Soto',
        items: [
            { name: 'Churrasco c/ Chimichurri', qty: 2 },
            { name: 'Pechuga a la Plancha', qty: 1, modifiers: [{ name: 'Término', value: 'Bien cocido' }] },
            { name: 'Medalla Light', qty: 3 }
        ],
        allergies: [],
        notes: 'El churrasco término medio.',
        status_history: [
            { status: OrderStatus.NEW, at: subtractMinutes(now, 18).toISOString(), by: 'System' },
            { status: OrderStatus.ACK, at: subtractMinutes(now, 15).toISOString(), by: 'Jefe' },
            { status: OrderStatus.IN_PREP, at: subtractMinutes(now, 12).toISOString(), by: 'Cocinero' }
        ],
    },
    {
        order_id: 'H-5D3E',
        source: OrderSource.WEB,
        status: OrderStatus.IN_PREP,
        priority: OrderPriority.NORMAL,
        created_at: subtractMinutes(now, 10).toISOString(),
        updated_at: subtractMinutes(now, 5).toISOString(),
        table_number: 'VIP 1',
        customer_name: 'Sr. Rivera',
        items: [{ name: 'Sancocho', qty: 1, notes: "Poco cilantro" }],
        allergies: [],
        notes: 'Cliente regular.',
        status_history: [
             { status: OrderStatus.NEW, at: subtractMinutes(now, 10).toISOString(), by: 'System' },
             { status: OrderStatus.ACK, at: subtractMinutes(now, 8).toISOString(), by: 'Jefe' },
             { status: OrderStatus.IN_PREP, at: subtractMinutes(now, 5).toISOString(), by: 'Cocinero' }
        ],
    },

    // READY Orders
    {
        order_id: 'W-7F6G',
        source: OrderSource.WHATSAPP,
        status: OrderStatus.READY,
        priority: OrderPriority.NORMAL,
        created_at: subtractMinutes(now, 25).toISOString(),
        updated_at: subtractMinutes(now, 2).toISOString(),
        table_number: 'Mesa 8',
        customer_name: null,
        items: [{ name: 'Alcapurrias', qty: 4 }, { name: 'Bacalaítos', qty: 4 }],
        allergies: [],
        notes: null,
        status_history: [
            { status: OrderStatus.NEW, at: subtractMinutes(now, 25).toISOString(), by: 'System' },
            { status: OrderStatus.ACK, at: subtractMinutes(now, 24).toISOString(), by: 'Cocinero' },
            { status: OrderStatus.IN_PREP, at: subtractMinutes(now, 20).toISOString(), by: 'Cocinero' },
            { status: OrderStatus.READY, at: subtractMinutes(now, 2).toISOString(), by: 'Cocinero' }
        ],
    },

    // SERVED Orders
    {
        order_id: 'H-2B1A',
        source: OrderSource.WEB,
        status: OrderStatus.SERVED,
        priority: OrderPriority.NORMAL,
        created_at: subtractMinutes(now, 35).toISOString(),
        updated_at: subtractMinutes(now, 10).toISOString(),
        table_number: 'Mesa 3',
        customer_name: 'Isabel',
        items: [{ name: 'Arroz con Gandules', qty: 1 }],
        allergies: [],
        notes: null,
        status_history: [
            { status: OrderStatus.NEW, at: subtractMinutes(now, 35).toISOString(), by: 'System' },
            { status: OrderStatus.ACK, at: subtractMinutes(now, 34).toISOString(), by: 'Jefe' },
            { status: OrderStatus.IN_PREP, at: subtractMinutes(now, 25).toISOString(), by: 'Cocinero' },
            { status: OrderStatus.READY, at: subtractMinutes(now, 12).toISOString(), by: 'Cocinero' },
            { status: OrderStatus.SERVED, at: subtractMinutes(now, 10).toISOString(), by: 'Expeditor' }
        ],
    },
    // Adding more active orders
    ...Array.from({ length: 10 }, (_, i) => {
        const statuses = [OrderStatus.NEW, OrderStatus.ACK, OrderStatus.IN_PREP, OrderStatus.READY, OrderStatus.SERVED];
        const sources = [OrderSource.WEB, OrderSource.WHATSAPP, OrderSource.VOICE];
        const priorities = [OrderPriority.NORMAL, OrderPriority.HIGH];
        const status = statuses[i % statuses.length];
        const createdAt = subtractMinutes(now, 30 - i);
        const updatedAt = subtractMinutes(createdAt, -5 - (i%3));

        return {
            order_id: `${sources[i % sources.length][0].toUpperCase()}-${Math.random().toString(16).substr(2, 4).toUpperCase()}`,
            source: sources[i % sources.length],
            status: status,
            priority: priorities[i % priorities.length],
            created_at: createdAt.toISOString(),
            updated_at: updatedAt.toISOString(),
            table_number: `Mesa ${i + 1}`,
            customer_name: ['Juan', 'Maria', 'Pedro', 'Sofia'][i % 4],
            items: [{ name: ['Mofongo', 'Tostones', 'Churrasco', 'Asopao'][i % 4], qty: 1 + (i % 2) }],
            allergies: i % 5 === 0 ? ['Lacteos'] : [],
            notes: i % 7 === 0 ? 'Nota de prueba' : null,
            status_history: [
                { status: OrderStatus.NEW, at: createdAt.toISOString(), by: 'System' },
                ...(status !== OrderStatus.NEW ? [{ status: status, at: updatedAt.toISOString(), by: 'Cocinero' }] : [])
            ],
        };
    }),
    // Archived and Canceled orders
    ...generateArchivedOrders(50),
];
