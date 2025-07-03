export interface Product {
    id: number;
    title: string;
    description: string;
    image_url: string;
}

export interface MonthlyDataProps {
    month: string;
    sale: number;
    users: number;
}

export interface CategoryDataProps {
    name: string;
    value: number;
}

export interface DeviceAccessDataProps {
    name: string;
    value: number;
    color: string;
}