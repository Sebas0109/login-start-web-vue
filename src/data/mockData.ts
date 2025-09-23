import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  date: string;
  name: string;
  ownerEmails: string[];
  package: 'classic' | 'premium' | 'silver';
  eventGroup: string;
  ownerName: string;
}

export interface EventGroup {
  id: string;
  name: string;
}

export interface GuestType {
  id: string;
  name: string;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  image?: string;
}

// Generate mock events
export const mockEvents: Event[] = [
  {
    id: uuidv4(),
    date: '2024-01-15',
    name: 'Sarah\'s Birthday Celebration',
    ownerEmails: ['sarah.jones@email.com'],
    package: 'premium',
    eventGroup: 'birthday',
    ownerName: 'Sarah Jones'
  },
  {
    id: uuidv4(),
    date: '2024-01-20',
    name: 'Corporate Annual Gala',
    ownerEmails: ['events@company.com', 'hr@company.com'],
    package: 'premium',
    eventGroup: 'corporate',
    ownerName: 'Jennifer Smith'
  },
  {
    id: uuidv4(),
    date: '2024-01-25',
    name: 'Wedding Reception - Miller & Johnson',
    ownerEmails: ['emily.miller@email.com', 'james.johnson@email.com'],
    package: 'classic',
    eventGroup: 'wedding',
    ownerName: 'Emily Miller'
  },
  {
    id: uuidv4(),
    date: '2024-02-01',
    name: 'Graduation Party',
    ownerEmails: ['mom.rodriguez@email.com'],
    package: 'silver',
    eventGroup: 'graduation',
    ownerName: 'Maria Rodriguez'
  },
  {
    id: uuidv4(),
    date: '2024-02-05',
    name: 'Baby Shower for Lisa',
    ownerEmails: ['lisa.williams@email.com', 'mom.williams@email.com'],
    package: 'classic',
    eventGroup: 'baby shower',
    ownerName: 'Lisa Williams'
  },
  {
    id: uuidv4(),
    date: '2024-02-10',
    name: 'Anniversary Dinner - 25 Years',
    ownerEmails: ['robert.davis@email.com'],
    package: 'premium',
    eventGroup: 'anniversary',
    ownerName: 'Robert Davis'
  },
  {
    id: uuidv4(),
    date: '2024-02-14',
    name: 'Valentine\'s Day Party',
    ownerEmails: ['party.planner@events.com'],
    package: 'silver',
    eventGroup: 'holiday',
    ownerName: 'Anna Taylor'
  },
  {
    id: uuidv4(),
    date: '2024-02-18',
    name: 'Retirement Celebration',
    ownerEmails: ['susan.brown@email.com', 'office@company.com'],
    package: 'classic',
    eventGroup: 'retirement',
    ownerName: 'Susan Brown'
  },
  {
    id: uuidv4(),
    date: '2024-02-22',
    name: 'Housewarming Party',
    ownerEmails: ['new.home@email.com'],
    package: 'silver',
    eventGroup: 'housewarming',
    ownerName: 'Michael Wilson'
  },
  {
    id: uuidv4(),
    date: '2024-02-28',
    name: 'Birthday Bash - Sweet 16',
    ownerEmails: ['teen.party@email.com', 'parent@email.com'],
    package: 'premium',
    eventGroup: 'birthday',
    ownerName: 'Patricia Garcia'
  },
  {
    id: uuidv4(),
    date: '2024-03-05',
    name: 'Spring Fundraiser Gala',
    ownerEmails: ['fundraiser@nonprofit.org'],
    package: 'premium',
    eventGroup: 'fundraiser',
    ownerName: 'David Thompson'
  },
  {
    id: uuidv4(),
    date: '2024-03-10',
    name: 'Book Club Anniversary',
    ownerEmails: ['bookclub@library.com'],
    package: 'classic',
    eventGroup: 'anniversary',
    ownerName: 'Helen Martinez'
  },
  {
    id: uuidv4(),
    date: '2024-03-15',
    name: 'St. Patrick\'s Day Celebration',
    ownerEmails: ['irish.pub@bar.com'],
    package: 'silver',
    eventGroup: 'holiday',
    ownerName: 'Patrick O\'Brien'
  },
  {
    id: uuidv4(),
    date: '2024-03-20',
    name: 'Team Building Retreat',
    ownerEmails: ['hr@techcompany.com', 'events@techcompany.com'],
    package: 'premium',
    eventGroup: 'corporate',
    ownerName: 'Alexandra Lee'
  },
  {
    id: uuidv4(),
    date: '2024-03-25',
    name: 'Easter Brunch',
    ownerEmails: ['family.event@email.com'],
    package: 'classic',
    eventGroup: 'holiday',
    ownerName: 'Catherine Anderson'
  }
];

export const mockEventGroups: EventGroup[] = [
  { id: uuidv4(), name: 'Birthday' },
  { id: uuidv4(), name: 'Wedding' },
  { id: uuidv4(), name: 'Corporate' },
  { id: uuidv4(), name: 'Graduation' },
  { id: uuidv4(), name: 'Anniversary' },
  { id: uuidv4(), name: 'Baby Shower' },
  { id: uuidv4(), name: 'Holiday' },
  { id: uuidv4(), name: 'Retirement' },
  { id: uuidv4(), name: 'Housewarming' },
  { id: uuidv4(), name: 'Fundraiser' }
];

export const mockGuestTypes: GuestType[] = [
  { id: uuidv4(), name: 'VIP Guest' },
  { id: uuidv4(), name: 'Regular Guest' },
  { id: uuidv4(), name: 'Family Member' },
  { id: uuidv4(), name: 'Business Partner' },
  { id: uuidv4(), name: 'Close Friend' },
  { id: uuidv4(), name: 'Colleague' },
  { id: uuidv4(), name: 'Plus One' }
];

export const mockAddons: Addon[] = [
  {
    id: uuidv4(),
    name: 'Premium Photography',
    description: 'Professional photographer for 6 hours including edited photos',
    image: '📸'
  },
  {
    id: uuidv4(),
    name: 'Live Music Band',
    description: '4-piece live band for entertainment during the event',
    image: '🎵'
  },
  {
    id: uuidv4(),
    name: 'Catering Upgrade',
    description: 'Premium catering menu with gourmet options',
    image: '🍽️'
  },
  {
    id: uuidv4(),
    name: 'Floral Arrangements',
    description: 'Custom floral centerpieces and decorations',
    image: '🌸'
  },
  {
    id: uuidv4(),
    name: 'Video Recording',
    description: 'Professional videography with same-day highlights reel',
    image: '🎬'
  },
  {
    id: uuidv4(),
    name: 'Special Lighting',
    description: 'Ambient lighting setup with color customization',
    image: '💡'
  },
  {
    id: uuidv4(),
    name: 'Photo Booth',
    description: 'Interactive photo booth with props and instant prints',
    image: '📷'
  },
  {
    id: uuidv4(),
    name: 'Dessert Station',
    description: 'Gourmet dessert bar with assorted sweets',
    image: '🧁'
  }
];