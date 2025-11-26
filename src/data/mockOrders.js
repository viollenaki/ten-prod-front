// Mock orders for TenProduct
const mockOrders = [
	{
		id: 'o1001',
		customer: 'Anna K.',
		address: 'Nevsky Ave, 12',
		total: 520,
		status: 'New',
		items: [ { id: 'p1', name: 'Russet Potatoes', qty: 2, price: 80 }, { id: 'p2', name: 'Organic Milk', qty:1, price:95 } ]
	},
	{
		id: 'o1002',
		customer: 'Ivan P.',
		address: 'Lenina St, 45',
		total: 760,
		status: 'In Progress',
		items: [ { id: 'p6', name: 'Chicken Breast', qty:1, price:320 }, { id: 'p3', name: 'Sourdough Bread', qty:2, price:150 } ]
	},
	{
		id: 'o1003',
		customer: 'Maria S.',
		address: 'Pushkina 3',
		total: 220,
		status: 'Delivered',
		items: [ { id: 'p4', name: 'Honey (250g)', qty:1, price:220 } ]
	}
];

export default mockOrders;
