import { apiClient } from '@/lib/apiClient';
import {
  EventStats,
  Guest,
  GuestsTableParams,
  Page,
  CreateGuestPayload,
  UpdateGuestPayload,
} from '@/types/eventDetail';

export const getEventStats = async (eventId: string): Promise<EventStats> => {
  return apiClient.get<EventStats>(`/api/event/dashboard-stats/${eventId}`);
};

export const getEventGuestsPage = async (
  eventId: string,
  params: GuestsTableParams = {}
): Promise<Page<Guest>> => {
  const queryParams = new URLSearchParams();

  if (params.keyword !== undefined) queryParams.append('keyword', params.keyword);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.order) queryParams.append('order', params.order);
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());

  return apiClient.get<Page<Guest>>(
    `/api/event/dashboard-table/${eventId}?${queryParams.toString()}`
  );
};

export const createGuest = async (
  eventId: string,
  payload: CreateGuestPayload
): Promise<Guest> => {
  return apiClient.post<Guest>(`/api/event/${eventId}/guest`, payload);
};

export const updateGuest = async (
  eventId: string,
  guestId: string,
  payload: UpdateGuestPayload
): Promise<Guest> => {
  return apiClient.put<Guest>(`/api/event/${eventId}/guest/${guestId}`, payload);
};

export const deleteGuest = async (
  eventId: string,
  guestId: string
): Promise<string> => {
  return apiClient.delete<string>(`/api/event/${eventId}/guest/${guestId}`);
};

export const getGuest = async (eventId: string, guestId: string): Promise<Guest> => {
  return apiClient.get<Guest>(`/api/event/${eventId}/guest/${guestId}`);
};
