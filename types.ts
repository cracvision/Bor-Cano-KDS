export enum OrderStatus {
  NEW = 'NEW',
  ACK = 'ACK',
  IN_PREP = 'IN_PREP',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELED = 'CANCELED',
  ARCHIVED = 'ARCHIVED'
}

export enum OrderSource {
  WHATSAPP = 'whatsapp',
  WEB = 'web',
  VOICE = 'voice'
}

export enum OrderPriority {
  HIGH = 'high',
  NORMAL = 'normal'
}

export interface OrderItemModifier {
  name: string;
  value: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  notes?: string;
  modifiers?: OrderItemModifier[];
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  at: string; // ISO Date string
  by: string; // User who made the change
}

export interface Order {
  order_id: string;
  source: OrderSource;
  status: OrderStatus;
  priority: OrderPriority;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  table_number: string | null;
  customer_name: string | null;
  items: OrderItem[];
  allergies: string[];
  notes: string | null;
  status_history: StatusHistoryEntry[];
}

// Types for Admin Archived View
export interface DateRange {
  from: string; // ISO Date string
  to: string; // ISO Date string
  preset?: 'today' | 'last_7d' | 'last_30d';
}

export interface ArchiveFilters {
  range: DateRange;
  source?: OrderSource[];
  priority?: OrderPriority[];
  text?: string;
  includeCanceled?: boolean;
  allergies?: string[];
}

export interface ArchiveQuery {
  filters: ArchiveFilters;
  pageSize: number;
  pageToken?: string; // a simple string, e.g., an index for mock data
  sort?: 'created_at_desc' | 'created_at_asc';
}

export interface ArchiveQueryResult {
  items: Order[];
  nextPageToken?: string;
  total?: number;
}
