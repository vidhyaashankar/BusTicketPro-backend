export interface Ticket {
  id: number;
  userId: number;
  passengerName: string;
  route: string;
  seatNumber: string;
  departureTime: string;
  fare: number;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
  createdAt?: string;
}
