export interface Service {
  key: string;
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive';
  description: string;
  providersCount: number;
}

export interface Booking {
  key: string;
  id: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  provider: string;
  price: number;
  address: string;
}