export interface Service {
  id: string;
  name: string;
  category: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  provider: string;
  price: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  service?: Service;
}