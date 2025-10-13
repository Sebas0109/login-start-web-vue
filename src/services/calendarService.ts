import { apiClient } from '@/lib/apiClient';

export interface CalendarEventDto {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
}

export interface CalendarParams {
  dateBegin: string; // YYYY-MM-DD
  dateEnd: string;   // YYYY-MM-DD
}

export const getCalendarEvents = async (params: CalendarParams): Promise<CalendarEventDto[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append('dateBegin', params.dateBegin);
  queryParams.append('dateEnd', params.dateEnd);
  
  return apiClient.get<CalendarEventDto[]>(`/api/event/calendar?${queryParams.toString()}`);
};

// Re-export from eventsService for convenience
export { getEventById, updateEvent, deleteEvent } from '@/services/eventsService';
