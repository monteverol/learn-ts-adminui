export interface Booking {
  id: string,
  status: string
}

export interface Service {
  id: string,
  name: string,
  category: string,
  price: number,
  status: "ACTIVE" | "INACTIVE",
  description: string,
  providersCount: number,
  createdAt: string,
  updatedAt: string,
  deletedAt?: string,
  bookings: Booking[]
}