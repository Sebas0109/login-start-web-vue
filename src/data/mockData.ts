import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  name: string;
  ownerEmails: string[];
  package: 'classic' | 'premium' | 'silver';
  eventGroup: string;
  ownerName: string;
  guestType: string;
  addons: string[];
  escortLimit: number;
  guestLimit: number;
  ownerUserId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
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

// Generate mock users
export const mockUsers: User[] = [
  { id: 'u1', name: 'Sarah Jones', email: 'sarah.jones@email.com' },
  { id: 'u2', name: 'Jennifer Smith', email: 'jennifer.smith@email.com' },
  { id: 'u3', name: 'Emily Miller', email: 'emily.miller@email.com' },
  { id: 'u4', name: 'Maria Rodriguez', email: 'maria.rodriguez@email.com' },
  { id: 'u5', name: 'Lisa Williams', email: 'lisa.williams@email.com' },
  { id: 'u6', name: 'Robert Davis', email: 'robert.davis@email.com' },
  { id: 'u7', name: 'Anna Taylor', email: 'anna.taylor@email.com' },
  { id: 'u8', name: 'Michael Wilson', email: 'michael.wilson@email.com' },
];

// Generate mock events with enhanced structure
export const mockEvents: Event[] = [
  {
    id: uuidv4(),
    title: 'Sarah\'s Birthday Celebration',
    date: '2025-01-15',
    time: '18:30',
    name: 'Sarah\'s Birthday Celebration',
    ownerEmails: ['sarah.jones@email.com'],
    package: 'premium',
    eventGroup: 'birthday',
    ownerName: 'Sarah Jones',
    guestType: 'family member',
    addons: ['photo_booth', 'premium_photography'],
    escortLimit: 2,
    guestLimit: 50,
    ownerUserId: 'u1'
  },
  {
    id: uuidv4(),
    title: 'Corporate Annual Gala',
    date: '2025-01-20',
    time: '19:00',
    name: 'Corporate Annual Gala',
    ownerEmails: ['events@company.com', 'hr@company.com'],
    package: 'premium',
    eventGroup: 'corporate',
    ownerName: 'Jennifer Smith',
    guestType: 'business partner',
    addons: ['live_music_band', 'special_lighting'],
    escortLimit: 1,
    guestLimit: 200,
    ownerUserId: 'u2'
  },
  {
    id: uuidv4(),
    title: 'Wedding Reception - Miller & Johnson',
    date: '2025-01-25',
    time: '17:00',
    name: 'Wedding Reception - Miller & Johnson',
    ownerEmails: ['emily.miller@email.com', 'james.johnson@email.com'],
    package: 'classic',
    eventGroup: 'wedding',
    ownerName: 'Emily Miller',
    guestType: 'family member',
    addons: ['floral_arrangements', 'video_recording'],
    escortLimit: 2,
    guestLimit: 120,
    ownerUserId: 'u3'
  },
  {
    id: uuidv4(),
    title: 'Graduation Party',
    date: '2025-02-01',
    time: '15:00',
    name: 'Graduation Party',
    ownerEmails: ['mom.rodriguez@email.com'],
    package: 'silver',
    eventGroup: 'graduation',
    ownerName: 'Maria Rodriguez',
    guestType: 'close friend',
    addons: ['dessert_station'],
    escortLimit: 1,
    guestLimit: 40,
    ownerUserId: 'u4'
  },
  {
    id: uuidv4(),
    title: 'Baby Shower for Lisa',
    date: '2025-02-05',
    time: '14:00',
    name: 'Baby Shower for Lisa',
    ownerEmails: ['lisa.williams@email.com', 'mom.williams@email.com'],
    package: 'classic',
    eventGroup: 'baby shower',
    ownerName: 'Lisa Williams',
    guestType: 'family member',
    addons: ['catering_upgrade'],
    escortLimit: 0,
    guestLimit: 30,
    ownerUserId: 'u5'
  },
  {
    id: uuidv4(),
    title: 'Anniversary Dinner - 25 Years',
    date: '2025-02-10',
    time: '19:30',
    name: 'Anniversary Dinner - 25 Years',
    ownerEmails: ['robert.davis@email.com'],
    package: 'premium',
    eventGroup: 'anniversary',
    ownerName: 'Robert Davis',
    guestType: 'vip guest',
    addons: ['premium_photography', 'special_lighting'],
    escortLimit: 2,
    guestLimit: 60,
    ownerUserId: 'u6'
  },
  {
    id: uuidv4(),
    title: 'Valentine\'s Day Party',
    date: '2025-02-14',
    time: '20:00',
    name: 'Valentine\'s Day Party',
    ownerEmails: ['party.planner@events.com'],
    package: 'silver',
    eventGroup: 'holiday',
    ownerName: 'Anna Taylor',
    guestType: 'regular guest',
    addons: ['live_music_band'],
    escortLimit: 1,
    guestLimit: 80,
    ownerUserId: 'u7'
  },
  {
    id: uuidv4(),
    title: 'Retirement Celebration',
    date: '2025-02-18',
    time: '16:00',
    name: 'Retirement Celebration',
    ownerEmails: ['susan.brown@email.com', 'office@company.com'],
    package: 'classic',
    eventGroup: 'retirement',
    ownerName: 'Susan Brown',
    guestType: 'colleague',
    addons: ['photo_booth'],
    escortLimit: 1,
    guestLimit: 50,
    ownerUserId: 'u2'
  },
  {
    id: uuidv4(),
    title: 'Housewarming Party',
    date: '2025-02-22',
    time: '18:00',
    name: 'Housewarming Party',
    ownerEmails: ['new.home@email.com'],
    package: 'silver',
    eventGroup: 'housewarming',
    ownerName: 'Michael Wilson',
    guestType: 'close friend',
    addons: ['catering_upgrade', 'dessert_station'],
    escortLimit: 2,
    guestLimit: 35,
    ownerUserId: 'u8'
  },
  {
    id: uuidv4(),
    title: 'Birthday Bash - Sweet 16',
    date: '2025-02-28',
    time: '17:30',
    name: 'Birthday Bash - Sweet 16',
    ownerEmails: ['teen.party@email.com', 'parent@email.com'],
    package: 'premium',
    eventGroup: 'birthday',
    ownerName: 'Patricia Garcia',
    guestType: 'family member',
    addons: ['photo_booth', 'live_music_band', 'special_lighting'],
    escortLimit: 0,
    guestLimit: 75,
    ownerUserId: 'u4'
  },
  {
    id: uuidv4(),
    title: 'Spring Fundraiser Gala',
    date: '2025-03-05',
    time: '18:30',
    name: 'Spring Fundraiser Gala',
    ownerEmails: ['fundraiser@nonprofit.org'],
    package: 'premium',
    eventGroup: 'fundraiser',
    ownerName: 'David Thompson',
    guestType: 'vip guest',
    addons: ['premium_photography', 'video_recording', 'live_music_band'],
    escortLimit: 2,
    guestLimit: 150,
    ownerUserId: 'u6'
  },
  {
    id: uuidv4(),
    title: 'Book Club Anniversary',
    date: '2025-03-10',
    time: '15:00',
    name: 'Book Club Anniversary',
    ownerEmails: ['bookclub@library.com'],
    package: 'classic',
    eventGroup: 'anniversary',
    ownerName: 'Helen Martinez',
    guestType: 'regular guest',
    addons: ['dessert_station'],
    escortLimit: 1,
    guestLimit: 25,
    ownerUserId: 'u7'
  },
  {
    id: uuidv4(),
    title: 'St. Patrick\'s Day Celebration',
    date: '2025-03-15',
    time: '19:00',
    name: 'St. Patrick\'s Day Celebration',
    ownerEmails: ['irish.pub@bar.com'],
    package: 'silver',
    eventGroup: 'holiday',
    ownerName: 'Patrick O\'Brien',
    guestType: 'regular guest',
    addons: ['live_music_band', 'catering_upgrade'],
    escortLimit: 1,
    guestLimit: 100,
    ownerUserId: 'u8'
  },
  {
    id: uuidv4(),
    title: 'Team Building Retreat',
    date: '2025-03-20',
    time: '09:00',
    name: 'Team Building Retreat',
    ownerEmails: ['hr@techcompany.com', 'events@techcompany.com'],
    package: 'premium',
    eventGroup: 'corporate',
    ownerName: 'Alexandra Lee',
    guestType: 'colleague',
    addons: ['catering_upgrade', 'photo_booth'],
    escortLimit: 0,
    guestLimit: 45,
    ownerUserId: 'u2'
  },
  {
    id: uuidv4(),
    title: 'Easter Brunch',
    date: '2025-03-25',
    time: '11:00',
    name: 'Easter Brunch',
    ownerEmails: ['family.event@email.com'],
    package: 'classic',
    eventGroup: 'holiday',
    ownerName: 'Catherine Anderson',
    guestType: 'family member',
    addons: ['floral_arrangements'],
    escortLimit: 2,
    guestLimit: 40,
    ownerUserId: 'u5'
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