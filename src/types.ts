export interface BookingRequest {
  name: string;
  contactNumber: string;
  secondaryContactNumber: string;
  guardianPrefix: string;
  guardianName: string;
  department: string;
  doctor: string;
  date: string;
  address: string;
  comments: string;
  appointmentType?: string; // e.g., 'Physical' or 'Virtual'
}

export interface CareService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}
