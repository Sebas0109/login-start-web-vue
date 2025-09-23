import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMockData } from '@/hooks/useMockData';
import { Event } from '@/data/mockData';
import { EventModal } from '@/components/EventModal';

type CalendarView = 'today' | 'week' | 'month' | 'agenda';

const Calendar = () => {
  const { currentRole } = useOutletContext<{ currentRole: 'ADMIN' | 'CLIENT' }>();
  const navigate = useNavigate();
  const { events } = useMockData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
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
          {todayEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No events scheduled for this day</p>
          ) : (
            todayEvents.map(event => (
              <Card
                key={event.id}
                className="cursor-pointer hover:bg-accent/30 transition-smooth bg-gradient-card backdrop-blur-lg border-border/30"
                onClick={() => handleEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{event.name}</h4>
                    <Badge variant="outline">{event.eventGroup}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.ownerName}</p>
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
                        onClick={() => handleEventClick(event)}
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
                        onClick={() => handleEventClick(event)}
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
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <div className="space-y-2">
          {sortedEvents.slice(0, 20).map(event => (
            <Card
              key={event.id}
              className="cursor-pointer hover:bg-accent/30 transition-smooth bg-gradient-card backdrop-blur-lg border-border/30"
              onClick={() => handleEventClick(event)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{event.eventGroup}</Badge>
                    <Badge className={
                      event.package === 'premium' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      event.package === 'classic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }>
                      {event.package}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-card backdrop-blur-lg border-border/50 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={view} onValueChange={(value) => setView(value as CalendarView)}>
              <TabsList className="grid w-full grid-cols-4 bg-secondary/30">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
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
        
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Calendar;