export interface UserProfile {
  name: string;
  balance: number;
  avatarUrl?: string;
  notificationOn: boolean;
  biometricOn: boolean;
}

export interface CardItem {
  id: string;
  name: string;
  number: string;
  balance: number;
  color: string;
  active: boolean;
  type: 'virtual' | 'physical';
  expiryDate: string;
}

export interface TripItem {
  id: string;
  title: string;
  date: string;
  price: number;
  type: 'metro' | 'bus' | 'recharge';
  station?: string;
  pendingSync?: boolean;
}
