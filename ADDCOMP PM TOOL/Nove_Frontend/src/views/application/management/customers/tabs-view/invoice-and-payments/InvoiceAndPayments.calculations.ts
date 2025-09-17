import { isNotNull, roundoffToString } from "src/helpers";
import { ICustomerInvoice } from "src/redux";


const calculateTotalAmount = (invoiceItems: ICustomerInvoice["invoice_items"]): number => {
    return invoiceItems.reduce((sum: number, item: any) => {
        return sum + isNotNull(item.total);
    }, 0)
};

const calculateTaxAndTotalAmount = (
    invoiceItems: ICustomerInvoice["invoice_items"]
): { subtotal: number; tax: number; total: number } => {
    return invoiceItems.reduce(
        (acc, item) => {
            const itemTotal = isNotNull(item.price); // assuming this returns number
            const taxPercent = isNotNull(item.tax) || 0; // handle missing tax
            const itemTax = (itemTotal * taxPercent) / 100;

            acc.subtotal += itemTotal;
            acc.tax += itemTax;
            acc.total += itemTotal + itemTax;

            return acc;
        },
        { subtotal: 0, tax: 0, total: 0 }
    );
};

type Totals = {
    subtotal: number;
    tax: number;
    total: number;
};

export interface ICustomerInvoiceItems {
    transaction_type: "SERVICE" | "PAYMENT" | "CORRECTION";
    correction_sign: "+" | "-";
    description: string;
    service_type: string;
    service_sub_type: string;
    tax: string;
    price: string;
}

const calculateTotalsByTransactionType = (
    invoiceItems: ICustomerInvoiceItems[]
): Record<"SERVICE" | "PAYMENT" | "CORRECTION", Totals> => {
    // Initialize the totals for each transaction type
    const initialTotals = {
        SERVICE: { subtotal: 0, tax: 0, total: 0 },
        PAYMENT: { subtotal: 0, tax: 0, total: 0 },
        CORRECTION: { subtotal: 0, tax: 0, total: 0 },
    };

    return invoiceItems.reduce((acc, item) => {
        const price = isNotNull(item.price);
        const taxPercent = isNotNull(item.tax);

        const taxAmount = (price * taxPercent) / 100;

        // Apply sign adjustment (+ or -) for "CORRECTION"
        let adjustedPrice = price;
        if (item.transaction_type === "CORRECTION") {
            const sign = item.correction_sign === "+" ? 1 : -1;
            adjustedPrice *= sign;
        }

        acc[item.transaction_type].subtotal += adjustedPrice;
        acc[item.transaction_type].tax += taxAmount;
        acc[item.transaction_type].total += adjustedPrice + taxAmount;

        return acc;
    }, initialTotals);
};


export const invoiceCalculationsSync = (invoice: ICustomerInvoice): ICustomerInvoice => {
    const { SERVICE, CORRECTION, PAYMENT } = calculateTotalsByTransactionType(invoice.invoice_items)

    console.log("SERVICE, CORRECTION, PAYMENT", { SERVICE, CORRECTION, PAYMENT })
    const tax = SERVICE.tax + PAYMENT.tax + CORRECTION.tax;
    const total = SERVICE.total + (-PAYMENT.total + CORRECTION.total);

    return {
        ...invoice,
        sub_total: roundoffToString(SERVICE.subtotal),
        payment_paid: roundoffToString(PAYMENT.total),
        adjustment: roundoffToString(CORRECTION.total),
        taxes: roundoffToString(SERVICE.tax),
        total: roundoffToString(total),
    }
}