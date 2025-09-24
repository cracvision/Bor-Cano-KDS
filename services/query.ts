import { initialOrders } from '../constants';
import { ArchiveQuery, ArchiveQueryResult, Order, OrderStatus, OrderSource, OrderPriority } from '../types';

/**
 * Mocks a query to a backend service for archived orders.
 * @param q The query parameters.
 * @returns A promise that resolves to the query result.
 */
export const queryArchivedOrders = (q: ArchiveQuery): Promise<ArchiveQueryResult> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const { filters, pageSize, pageToken, sort } = q;
            
            // 1. Filter by status (ARCHIVED and optionally CANCELED)
            let results = initialOrders.filter(order => {
                const isArchived = order.status === OrderStatus.ARCHIVED;
                const isCanceled = order.status === OrderStatus.CANCELED;
                return isArchived || (filters.includeCanceled && isCanceled);
            });
            
            // 2. Filter by date range
            if (filters.range) {
                const from = new Date(filters.range.from).getTime();
                const to = new Date(filters.range.to).getTime();
                results = results.filter(order => {
                    const createdAt = new Date(order.created_at).getTime();
                    return createdAt >= from && createdAt <= to;
                });
            }

            // 3. Filter by source
            if (filters.source && filters.source.length > 0) {
                results = results.filter(order => filters.source!.includes(order.source));
            }

            // 4. Filter by priority
            if (filters.priority && filters.priority.length > 0) {
                results = results.filter(order => filters.priority!.includes(order.priority));
            }

            // 5. Filter by text search (order_id, table_number, customer_name)
            if (filters.text) {
                const searchTerm = filters.text.toLowerCase();
                results = results.filter(order => 
                    order.order_id.toLowerCase().includes(searchTerm) ||
                    (order.table_number && order.table_number.toLowerCase().includes(searchTerm)) ||
                    (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm))
                );
            }

            // 6. Sort
            results.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sort === 'created_at_asc' ? dateA - dateB : dateB - dateA;
            });
            
            // 7. Paginate
            const startIndex = pageToken ? parseInt(pageToken, 10) : 0;
            const endIndex = startIndex + pageSize;
            const paginatedItems = results.slice(startIndex, endIndex);
            
            const nextPageToken = endIndex < results.length ? String(endIndex) : undefined;

            resolve({
                items: paginatedItems,
                nextPageToken,
                total: results.length,
            });

        }, 500); // Simulate network delay
    });
};

/**
 * Mocks exporting data to a CSV format.
 * @param q The query parameters for the data to export.
 * @returns A promise that resolves to a string representing the CSV content.
 */
export const exportArchived = (q: ArchiveQuery): Promise<string> => {
    return new Promise(async resolve => {
        // Remove pagination for export
        const exportQuery = { ...q, pageSize: Infinity, pageToken: undefined };
        const result = await queryArchivedOrders(exportQuery);
        
        let csvContent = "order_id,status,created_at,source,priority,table_number,customer_name,item_count\n";
        result.items.forEach(order => {
            const itemCount = order.items.reduce((acc, item) => acc + item.qty, 0);
            const row = [
                order.order_id,
                order.status,
                order.created_at,
                order.source,
                order.priority,
                order.table_number || '',
                order.customer_name || '',
                itemCount,
            ].join(',');
            csvContent += row + "\n";
        });
        
        console.log("Generated CSV Content:\n", csvContent);
        resolve(csvContent);
    });
};
