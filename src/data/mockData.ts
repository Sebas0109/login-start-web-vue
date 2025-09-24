import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  date: string;
  time: string;
  name: string;
  ownerEmails: string[];
  package: 'classic' | 'premium' | 'silver';
  eventGroup: string;
  guestType: string;
  addons: string[];
  ownerName: string;
  ownerUserId: string;
  escortLimit: number;
  guestLimit: number;
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

// Generate mock events with current dates for better calendar visibility
export const mockEvents: Event[] = [
  {
    id: uuidv4(),
    date: '2025-09-15',
    time: '18:30',
    name: 'Sarah\'s Birthday Celebration',
    ownerEmails: ['sarah.jones@email.com'],
    package: 'premium',
    eventGroup: 'birthday',
    guestType: 'family',
    addons: ['photo_booth', 'dessert_station'],
    ownerName: 'Sarah Jones',
    ownerUserId: 'user_001',
    escortLimit: 2,
    guestLimit: 50
  },
  {
    id: uuidv4(),
    date: '2025-09-20',
    time: '19:00',
    name: 'Corporate Annual Gala',
    ownerEmails: ['events@company.com', 'hr@company.com'],
    package: 'premium',
    eventGroup: 'corporate',
    guestType: 'business',
    addons: ['live_music', 'premium_photography'],
    ownerName: 'Jennifer Smith',
    ownerUserId: 'user_002',
    escortLimit: 1,
    guestLimit: 200
  },
  {
    id: uuidv4(),
    date: '2025-09-25',
    time: '17:00',
    name: 'Wedding Reception - Miller & Johnson',
    ownerEmails: ['emily.miller@email.com', 'james.johnson@email.com'],
    package: 'classic',
    eventGroup: 'wedding',
    guestType: 'vip',
    addons: ['floral_arrangements', 'video_recording'],
    ownerName: 'Emily Miller',
    ownerUserId: 'user_003',
    escortLimit: 2,
    guestLimit: 150
  },
  {
    id: uuidv4(),
    date: '2025-09-28',
    time: '16:00',
    name: 'Graduation Party',
    ownerEmails: ['mom.rodriguez@email.com'],
    package: 'silver',
    eventGroup: 'graduation',
    guestType: 'family',
    addons: ['photo_booth'],
    ownerName: 'Maria Rodriguez',
    ownerUserId: 'user_004',
    escortLimit: 1,
    guestLimit: 80
  },
  {
    id: uuidv4(),
    date: '2025-10-01',
    time: '14:00',
    name: 'Baby Shower for Lisa',
    ownerEmails: ['lisa.williams@email.com', 'mom.williams@email.com'],
    package: 'classic',
    eventGroup: 'baby shower',
    guestType: 'family',
    addons: ['dessert_station'],
    ownerName: 'Lisa Williams',
    ownerUserId: 'user_005',
    escortLimit: 0,
    guestLimit: 30
  },
  {
    id: uuidv4(),
    date: '2025-10-05',
    time: '19:30',
    name: 'Anniversary Dinner - 25 Years',
    ownerEmails: ['robert.davis@email.com'],
    package: 'premium',
    eventGroup: 'anniversary',
    guestType: 'vip',
    addons: ['floral_arrangements', 'special_lighting'],
    ownerName: 'Robert Davis',
    ownerUserId: 'user_005',
    escortLimit: 2,
    guestLimit: 40
  },
  {
    id: uuidv4(),
    date: '2025-10-10',
    time: '20:00',
    name: 'Halloween Party',
    ownerEmails: ['party.planner@events.com'],
    package: 'silver',
    eventGroup: 'holiday',
    guestType: 'regular',
    addons: ['special_lighting', 'dessert_station'],
    ownerName: 'Anna Taylor',
    ownerUserId: 'user_006',
    escortLimit: 1,
    guestLimit: 100
  },
  {
    id: uuidv4(),
    date: '2025-10-15',
    time: '18:00',
    name: 'Retirement Celebration',
    ownerEmails: ['susan.brown@email.com', 'office@company.com'],
    package: 'classic',
    eventGroup: 'retirement',
    guestType: 'colleague',
    addons: ['catering_upgrade'],
    ownerName: 'Susan Brown',
    ownerUserId: 'user_007',
    escortLimit: 1,
    guestLimit: 60
  },
  {
    id: uuidv4(),
    date: '2025-10-18',
    time: '17:30',
    name: 'Housewarming Party',
    ownerEmails: ['new.home@email.com'],
    package: 'silver',
    eventGroup: 'housewarming',
    guestType: 'close_friend',
    addons: ['live_music'],
    ownerName: 'Michael Wilson',
    ownerUserId: 'user_007',
    escortLimit: 2,
    guestLimit: 70
  },
  {
    id: uuidv4(),
    date: '2025-10-22',
    time: '19:00',
    name: 'Birthday Bash - Sweet 16',
    ownerEmails: ['teen.party@email.com', 'parent@email.com'],
    package: 'premium',
    eventGroup: 'birthday',
    guestType: 'family',
    addons: ['photo_booth', 'live_music', 'special_lighting'],
    ownerName: 'Patricia Garcia',
    ownerUserId: 'user_008',
    escortLimit: 2,
    guestLimit: 90
  },
  {
    id: uuidv4(),
    date: '2025-10-25',
    time: '18:30',
    name: 'Spring Fundraiser Gala',
    ownerEmails: ['fundraiser@nonprofit.org'],
    package: 'premium',
    eventGroup: 'fundraiser',
    guestType: 'business',
    addons: ['premium_photography', 'live_music', 'catering_upgrade'],
    ownerName: 'David Thompson',
    ownerUserId: 'user_001',
    escortLimit: 1,
    guestLimit: 300
  },
  {
    id: uuidv4(),
    date: '2025-11-01',
    time: '15:00',
    name: 'Book Club Anniversary',
    ownerEmails: ['bookclub@library.com'],
    package: 'classic',
    eventGroup: 'anniversary',
    guestType: 'close_friend',
    addons: ['dessert_station'],
    ownerName: 'Helen Martinez',
    ownerUserId: 'user_002',
    escortLimit: 0,
    guestLimit: 25
  },
  {
    id: uuidv4(),
    date: '2025-11-05',
    time: '18:00',
    name: 'Conference Networking Event',
    ownerEmails: ['irish.pub@bar.com'],
    package: 'silver',
    eventGroup: 'corporate',
    guestType: 'business',
    addons: ['catering_upgrade', 'live_music'],
    ownerName: 'Patrick O\'Brien',
    ownerUserId: 'user_003',
    escortLimit: 1,
    guestLimit: 120
  },
  {
    id: uuidv4(),
    date: '2025-11-10',
    time: '09:00',
    name: 'Team Building Retreat',
    ownerEmails: ['hr@techcompany.com', 'events@techcompany.com'],
    package: 'premium',
    eventGroup: 'corporate',
    guestType: 'colleague',
    addons: ['catering_upgrade', 'video_recording'],
    ownerName: 'Alexandra Lee',
    ownerUserId: 'user_004',
    escortLimit: 0,
    guestLimit: 50
  },
  {
    id: uuidv4(),
    date: '2025-11-15',
    time: '17:00',
    name: 'Holiday Party',
    ownerEmails: ['family.event@email.com'],
    package: 'classic',
    eventGroup: 'holiday',
    guestType: 'family',
    addons: ['dessert_station', 'photo_booth'],
    ownerName: 'Catherine Anderson',
    ownerUserId: 'user_006',
    escortLimit: 2,
    guestLimit: 60
  },
  {
    id: uuidv4(),
    date: '2025-12-01',
    time: '19:30',
    name: 'Christmas Gala',
    ownerEmails: ['christmas@events.com'],
    package: 'premium',
    eventGroup: 'holiday',
    guestType: 'vip',
    addons: ['premium_photography', 'live_music', 'floral_arrangements', 'special_lighting'],
    ownerName: 'Michael Christmas',
    ownerUserId: 'user_008',
    escortLimit: 2,
    guestLimit: 250
  },
  {
    id: uuidv4(),
    date: '2025-12-15',
    time: '14:00',
    name: 'New Year Planning Meeting',
    ownerEmails: ['planning@company.com'],
    package: 'silver',
    eventGroup: 'corporate',
    guestType: 'business',
    addons: ['catering_upgrade'],
    ownerName: 'Rachel Planning',
    ownerUserId: 'user_001',
    escortLimit: 0,
    guestLimit: 20
  },
  {
    id: uuidv4(),
    date: '2025-12-31',
    time: '21:00',
    name: 'New Year\'s Eve Celebration',
    ownerEmails: ['nye@party.com'],
    package: 'premium',
    eventGroup: 'holiday',
    guestType: 'vip',
    addons: ['premium_photography', 'live_music', 'special_lighting', 'dessert_station'],
    ownerName: 'Party Master',
    ownerUserId: 'user_002',
    escortLimit: 3,
    guestLimit: 500
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
    id: 'premium_photography',
    name: 'Premium Photography',
    description: 'Professional photographer for 6 hours including edited photos',
    image: '📸'
  },
  {
    id: 'live_music',
    name: 'Live Music Band',
    description: '4-piece live band for entertainment during the event',
    image: '🎵'
  },
  {
    id: 'catering_upgrade',
    name: 'Catering Upgrade',
    description: 'Premium catering menu with gourmet options',
    image: '🍽️'
  },
  {
    id: 'floral_arrangements',
    name: 'Floral Arrangements',
    description: 'Custom floral centerpieces and decorations',
    image: '🌸'
  },
  {
    id: 'video_recording',
    name: 'Video Recording',
    description: 'Professional videography with same-day highlights reel',
    image: '🎬'
  },
  {
    id: 'special_lighting',
    name: 'Special Lighting',
    description: 'Ambient lighting setup with color customization',
    image: '💡'
  },
  {
    id: 'photo_booth',
    name: 'Photo Booth',
    description: 'Interactive photo booth with props and instant prints',
    image: '📷'
  },
  {
    id: 'dessert_station',
    name: 'Dessert Station',
    description: 'Gourmet dessert bar with assorted sweets',
    image: '🧁'
  }
];

export const mockUsers: User[] = [
  { id: 'user_001', name: 'Sarah Jones', email: 'sarah.jones@email.com' },
  { id: 'user_002', name: 'Jennifer Smith', email: 'jennifer.smith@company.com' },
  { id: 'user_003', name: 'Emily Miller', email: 'emily.miller@email.com' },
  { id: 'user_004', name: 'Maria Rodriguez', email: 'maria.rodriguez@email.com' },
  { id: 'user_005', name: 'Robert Davis', email: 'robert.davis@email.com' },
  { id: 'user_006', name: 'Anna Taylor', email: 'anna.taylor@events.com' },
  { id: 'user_007', name: 'Michael Wilson', email: 'michael.wilson@email.com' },
  { id: 'user_008', name: 'Patricia Garcia', email: 'patricia.garcia@email.com' }
];