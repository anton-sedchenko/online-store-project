export const AVAILABILITY_STATUSES = {
    IN_STOCK: 'IN_STOCK',
    MADE_TO_ORDER: 'MADE_TO_ORDER',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
};

const AVAILABILITY_LABELS = {
    [AVAILABILITY_STATUSES.IN_STOCK]: 'В наявності',
    [AVAILABILITY_STATUSES.MADE_TO_ORDER]: 'Під замовлення',
    [AVAILABILITY_STATUSES.OUT_OF_STOCK]: 'Немає в наявності',
};

const AVAILABILITY_CLASSES = {
    [AVAILABILITY_STATUSES.IN_STOCK]: 'availability-value in-stock',
    [AVAILABILITY_STATUSES.MADE_TO_ORDER]: 'availability-value pre-order',
    [AVAILABILITY_STATUSES.OUT_OF_STOCK]: 'availability-value out-of-stock',
};

const PURCHASABLE_STATUSES = new Set([
    AVAILABILITY_STATUSES.IN_STOCK,
    AVAILABILITY_STATUSES.MADE_TO_ORDER,
]);

export const isKnownAvailability = (status) => Object.prototype.hasOwnProperty.call(AVAILABILITY_LABELS, status);

export const getAvailabilityLabel = (status) => AVAILABILITY_LABELS[status] || '';

export const getAvailabilityClass = (status) => AVAILABILITY_CLASSES[status] || 'availability-value';

export const isPurchasableAvailability = (status) => PURCHASABLE_STATUSES.has(status);

export const availabilityOptions = [
    {value: AVAILABILITY_STATUSES.IN_STOCK, label: AVAILABILITY_LABELS[AVAILABILITY_STATUSES.IN_STOCK]},
    {value: AVAILABILITY_STATUSES.MADE_TO_ORDER, label: AVAILABILITY_LABELS[AVAILABILITY_STATUSES.MADE_TO_ORDER]},
    {value: AVAILABILITY_STATUSES.OUT_OF_STOCK, label: AVAILABILITY_LABELS[AVAILABILITY_STATUSES.OUT_OF_STOCK]},
];
