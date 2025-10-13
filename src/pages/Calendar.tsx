import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCalendarEvents, CalendarEventDto, getEventById } from '@/services/calendarService';
import { EventDto } from '@/types/event';
import EventModal from '@/components/EventModal';
import { useToast } from '@/hooks/use-toast';

type CalendarView = 'today' | 'week' | 'month' | 'agenda';

interface CalendarEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  ownerName: string;
  package: string;
  eventGroup: string;
}

const Calendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<{ [key: string]: CalendarEvent[] }>({});
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadEvents = useCallback(async (dateBegin: string, dateEnd: string) => {
    const cacheKey = `${dateBegin}_${dateEnd}`;
    
    // Check cache first
    if (cacheRef.current[cacheKey]) {
      setEvents(cacheRef.current[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      const data = await getCalendarEvents({ dateBegin, dateEnd });
      
      // Transform backend data to calendar events
      const calendarEvents: CalendarEvent[] = data.map((item: CalendarEventDto) => ({
        id: item.id,
        name: '', // Will be loaded on demand
        date: item.date,
        time: item.time,
        ownerName: '',
        package: '',
        eventGroup: ''
      }));
      
      cacheRef.current[cacheKey] = calendarEvents;
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los eventos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshCalendar = useCallback(() => {
    // Clear cache and reload current range
    cacheRef.current = {};
    const { dateBegin, dateEnd } = getDateRange();
    loadEvents(dateBegin, dateEnd);
  }, [loadEvents]);

  const getDateRange = useCallback(() => {
    let start: Date;
    let end: Date;

    if (view === 'today') {
      start = currentDate;
      end = currentDate;
    } else if (view === 'week') {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    } else if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      start = startOfWeek(monthStart);
      end = endOfWeek(monthEnd);
    } else { // agenda
      start = new Date();
      end = addDays(new Date(), 90); // Load next 90 days
    }

    return {
      dateBegin: format(start, 'yyyy-MM-dd'),
      dateEnd: format(end, 'yyyy-MM-dd')
    };
  }, [currentDate, view]);

  useEffect(() => {
    // Debounce loading
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = setTimeout(() => {
      const { dateBegin, dateEnd } = getDateRange();
      loadEvents(dateBegin, dateEnd);
    }, 300);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [currentDate, view, getDateRange, loadEvents]);

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const handleEventClick = async (event: CalendarEvent) => {
    // If event details are not loaded, fetch them
    if (!event.name) {
      try {
        const fullEvent = await getEventById(event.id);
        const enrichedEvent: CalendarEvent = {
          id: fullEvent.id,
          name: fullEvent.title,
          date: fullEvent.date,
          time: fullEvent.time,
          ownerName: fullEvent.userDto?.person?.name || '',
          package: fullEvent._packageDto?.title || '',
          eventGroup: fullEvent.eventGroupDto?.title || ''
        };
        setSelectedEvent(enrichedEvent);
      } catch (error) {
        console.error('Error loading event details:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los detalles del evento',
          variant: 'destructive'
        });
        return;
      }
    } else {
      setSelectedEvent(event);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        return newDate;
      });
    } else if (view === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
    } else if (view === 'today') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
    }
  };

  const renderTodayView = () => {
    const todayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Cargando eventos...</p>
          ) : todayEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay eventos en este rango</p>
          ) : (
            todayEvents.map(event => (
              <Card
                key={event.id}
                className="cursor-pointer hover:bg-accent/30 transition-smooth bg-gradient-card backdrop-blur-lg border-border/30"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.time}</h4>
                    <Badge variant="outline">Ver detalles</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startWeek = startOfWeek(currentDate);
    const endWeek = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: startWeek, end: endWeek });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(startWeek, 'MMM d')} - {format(endWeek, 'MMM d, yyyy')}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              This Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayEvents = getEventsForDate(day);
            return (
              <Card key={day.toISOString()} className="min-h-[120px] bg-gradient-card backdrop-blur-lg border-border/30">
                <CardContent className="p-2">
                  <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-primary' : ''}`}>
                    {format(day, 'EEE d')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <Badge
                        key={event.id}
                        variant="secondary"
                        className="block text-xs cursor-pointer hover:bg-accent/50 transition-smooth truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {calendarDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <Card 
                key={day.toISOString()} 
                className={`min-h-[100px] ${!isCurrentMonth ? 'opacity-50' : ''} bg-gradient-card backdrop-blur-lg border-border/30`}
              >
                <CardContent className="p-2">
                  <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <Badge
                        key={event.id}
                        variant="secondary"
                        className="block text-xs cursor-pointer hover:bg-accent/50 transition-smooth truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {event.name}
                      </Badge>
                    ))}
                    {dayEvents.length > 2 && (
                      <Badge variant="outline" className="block text-xs">
                        +{dayEvents.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgendaView = () => {
    const sortedEvents = [...events]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter(event => new Date(event.date) >= new Date());

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Próximos Eventos</h3>
        <div className="space-y-2">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Cargando eventos...</p>
          ) : sortedEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay eventos en este rango</p>
          ) : (
            sortedEvents.slice(0, 20).map(event => (
              <Card
                key={event.id}
                className="cursor-pointer hover:bg-accent/30 transition-smooth bg-gradient-card backdrop-blur-lg border-border/30"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')} - {event.time}</h4>
                    </div>
                    <Badge variant="outline">Ver detalles</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={view} onValueChange={(value) => setView(value as CalendarView)}>
              <TabsList className="grid w-full grid-cols-4 bg-secondary/30">
                <TabsTrigger value="today">Hoy</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-6">
                {renderTodayView()}
              </TabsContent>
              
              <TabsContent value="week" className="mt-6">
                {renderWeekView()}
              </TabsContent>
              
              <TabsContent value="month" className="mt-6">
                {renderMonthView()}
              </TabsContent>
              
              <TabsContent value="agenda" className="mt-6">
                {renderAgendaView()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefresh={refreshCalendar}
      />
    </div>
  );
};

export default Calendar;