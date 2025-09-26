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
  User,
  Guest
} from '@/data/mockData';

export const useMockData = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [eventGroups, setEventGroups] = useState<EventGroup[]>(mockEventGroups);
  const [guestTypes, setGuestTypes] = useState<GuestType[]>(mockGuestTypes);
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const addEvent = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent]);
  };

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

  const addEventGroup = (newGroup: EventGroup) => {
    setEventGroups(prev => [...prev, newGroup]);
  };

  const addGuestType = (newType: GuestType) => {
    setGuestTypes(prev => [...prev, newType]);
  };

  const addAddon = (newAddon: Addon) => {
    setAddons(prev => [...prev, newAddon]);
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const updateGuest = (eventId: string, guestId: string, updatedGuest: Partial<Guest>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? {
            ...event, 
            guests: event.guests.map(guest => 
              guest.id === guestId ? { ...guest, ...updatedGuest } : guest
            )
          }
        : event
    ));
  };

  const deleteGuest = (eventId: string, guestId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, guests: event.guests.filter(guest => guest.id !== guestId) }
        : event
    ));
  };

  return {
    events,
    eventGroups,
    guestTypes,
    addons,
    users,
    addEvent,
    updateEvent,
    deleteEvent,
    updateEventGroup,
    deleteEventGroup,
    updateGuestType,
    deleteGuestType,
    updateAddon,
    deleteAddon,
    addEventGroup,
    addGuestType,
    addAddon,
    updateUser,
    deleteUser,
    updateGuest,
    deleteGuest
  };
};