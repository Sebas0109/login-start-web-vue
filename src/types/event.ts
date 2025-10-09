export interface Person {
  id: number;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  stateCode: string;
  phone: string;
}

export interface UserDto {
  id: number;
  email: string;
  person: Person;
  profile: string;
}

export interface EventGroupDto {
  id: number;
  title: string;
}

export interface PackageDto {
  id: number;
  title: string;
  description: string;
  price: number;
}

export interface Addon {
  id: number;
  title: string;
  icon: string;
}

export interface Slug {
  id: number;
  slug: string;
}

export interface GuestTypeDto {
  id: number;
  title: string;
}

export interface EventDto {
  id: string; // uuid
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  userDto: UserDto;
  eventGroupDto: EventGroupDto;
  _packageDto: PackageDto;
  guestTypeDto?: GuestTypeDto;
  addons: Addon[];
  notificationEmails: string[];
  limitGuests: number;
  escortsLimit: number;
  slugs: Slug[];
}

export interface CreateEventPayload {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  slugs: { slug: string }[];
  userId: number;
  eventGroupId: number;
  packageId: number;
  addonIds: number[];
  guestTypeId: number;
  notificationEmails: string[];
  limitGuests: number;
  escortsLimit: number;
}

export interface UpdateEventPayload {
  id: string; // uuid
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  slugs: { id: number; slug: string }[];
  userId: number;
  eventGroupId: number;
  packageId: number;
  addonIds: number[];
  guestTypeId: number;
  notificationEmails: string[];
  limitGuests: number;
  escortsLimit: number;
}

export interface EventsTableParams {
  keyword?: string;
  dateInit?: string; // YYYY-MM-DD
  dateEnd?: string; // YYYY-MM-DD
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

export interface EventListItem {
  id: string; // uuid
  title: string;
  date: string;
  time: string;
  package: {
    id: number;
    title: string;
  };
}
