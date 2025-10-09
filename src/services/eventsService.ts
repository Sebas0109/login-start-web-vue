import { apiClient } from '@/lib/apiClient';
import {
  CreateEventPayload,
  UpdateEventPayload,
  EventDto,
  EventsTableParams,
  Page,
  EventListItem
} from '@/types/event';

export const createEvent = async (payload: CreateEventPayload): Promise<EventDto> => {
  return apiClient.post<EventDto>('/api/event/create', payload);
};

export const getEventsPage = async (params: EventsTableParams): Promise<Page<EventDto>> => {
  const queryParams = new URLSearchParams();
  
  if (params.keyword !== undefined) queryParams.append('keyword', params.keyword);
  if (params.dateInit) queryParams.append('dateInit', params.dateInit);
  if (params.dateEnd) queryParams.append('dateEnd', params.dateEnd);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.order) queryParams.append('order', params.order);
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());

  return apiClient.get<Page<EventDto>>(`/api/event/datatable?${queryParams.toString()}`);
};

export const getEventById = async (id: string): Promise<EventDto> => {
  return apiClient.get<EventDto>(`/api/event/get/${id}`);
};

export const updateEvent = async (payload: UpdateEventPayload): Promise<EventDto> => {
  return apiClient.put<EventDto>('/api/event/update', payload);
};

export const deleteEvent = async (id: string): Promise<string> => {
  return apiClient.delete<string>(`/api/event/${id}`);
};

export const getEventsList = async (): Promise<EventListItem[]> => {
  return apiClient.get<EventListItem[]>('/api/event/list');
};
