import Payment from '../models/Payments.js';

const getDailySales = async () => {
    return await Payment.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$PaymentDate" } },
                total: { $sum: "$AmountPaid" }
            }
        }
    ]);
};

export default { getDailySales };