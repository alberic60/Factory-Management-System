const invoiceGenerator = (order, items) => {
    return {
        order,
        items,
        generatedAt: new Date()
    };
};

export { invoiceGenerator };