export interface EventStats {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  totalGuests: number;
  totalAssisting: number;
  totalNotAssisting: number;
  totalUnconfirmed: number;
  _package: {
    id: number;
    title: string;
    description: string;
    price: number;
  };
  eventGroup: {
    id: number;
    title: string;
  };
}

export interface Guest {
  id: string; // uuid
  eventId: string; // uuid
  paternalSurname: string;
  maternalSurname: string;
  name: string;
  phoneNumber: string;
  assistance: number; // numeric status
  escorts: number;
  personalMessage: string;
  notes: string;
}

export interface GuestsTableParams {
  keyword?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateGuestPayload {
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  phoneNumber: string;
  assistance: number;
  escorts: number;
  personalMessage: string;
  notes: string;
}

export interface UpdateGuestPayload extends CreateGuestPayload {}
