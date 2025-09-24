import { useState } from 'react';
import { 
  mockEvents, 
  mockEventGroups, 
  mockGuestTypes, 
  mockAddons,
  mockUsers,
  Event,
  EventGroup,
  GuestType,
  Addon,
  User
} from '@/data/mockData';

export const useMockData = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [eventGroups, setEventGroups] = useState<EventGroup[]>(mockEventGroups);
  const [guestTypes, setGuestTypes] = useState<GuestType[]>(mockGuestTypes);
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const updateEventGroup = (id: string, updatedGroup: Partial<EventGroup>) => {
    setEventGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updatedGroup } : group
    ));
  };

  const deleteEventGroup = (id: string) => {
    setEventGroups(prev => prev.filter(group => group.id !== id));
  };

  const updateGuestType = (id: string, updatedType: Partial<GuestType>) => {
    setGuestTypes(prev => prev.map(type => 
      type.id === id ? { ...type, ...updatedType } : type
    ));
  };

  const deleteGuestType = (id: string) => {
    setGuestTypes(prev => prev.filter(type => type.id !== id));
  };

  const updateAddon = (id: string, updatedAddon: Partial<Addon>) => {
    setAddons(prev => prev.map(addon => 
      addon.id === id ? { ...addon, ...updatedAddon } : addon
    ));
  };

  const deleteAddon = (id: string) => {
    setAddons(prev => prev.filter(addon => addon.id !== id));
  };

  return {
    events,
    eventGroups,
    guestTypes,
    addons,
    users,
    updateEvent,
    deleteEvent,
    updateEventGroup,
    deleteEventGroup,
    updateGuestType,
    deleteGuestType,
    updateAddon,
    deleteAddon
  };
};