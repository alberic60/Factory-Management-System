import Payment from '../models/Payments.js';

const dailySalesReport = async (req, res) => {
    try {
        const today = new Date();
        const report = await Payment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$PaymentDate" } },
                    totalSales: { $sum: "$AmountPaid" }
                }
            }
        ]);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { dailySalesReport };
