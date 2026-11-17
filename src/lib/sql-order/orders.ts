export type Order = {
    id: number;
    customer: string;
    amount: number;
    orderDate: string;
};

export const orders: Order[] = [
    { id: 1, customer: "Ana", amount: 120, orderDate: "2026-09-18" },
    { id: 2,  customer: "Ben", amount: 40,  orderDate: "2026-10-02" },
    { id: 3,  customer: "Ana", amount: 35,  orderDate: "2026-10-03" },
    { id: 4,  customer: "Cy",  amount: 80,  orderDate: "2026-10-05" },
    { id: 5,  customer: "Dee", amount: 20,  orderDate: "2026-10-08" },
    { id: 6,  customer: "Ben", amount: 45,  orderDate: "2026-10-11" },
    { id: 7,  customer: "Eli", amount: 60,  orderDate: "2026-10-14" },
    { id: 8,  customer: "Cy",  amount: 25,  orderDate: "2026-10-19" },
    { id: 9,  customer: "Dee", amount: 15,  orderDate: "2026-09-27" },
    { id: 10, customer: "Ana", amount: 30,  orderDate: "2026-10-24" },
];