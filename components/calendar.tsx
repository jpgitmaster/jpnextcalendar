import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list'
// import { useRef } from "react";

const Calendar = (events: any) => {
//   const calendarRef = useRef(null);
    const handleDateSelect = (selectInfo: any) => {
        // let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar
        console.log(selectInfo);
        console.log(calendarApi);
        // calendarApi.unselect() // clear date selection
    
        // if (title) {
        //   calendarApi.addEvent({
        //     id: createEventId(),
        //     title,
        //     start: selectInfo.startStr,
        //     end: selectInfo.endStr,
        //     allDay: selectInfo.allDay
        //   })
        // }
      }
  return (
    <FullCalendar
    //   innerRef={calendarRef}
      plugins={[listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
      editable
      selectable
      initialView="listWeek"
      events={events}
      // events={[
      //   { title: 'e-Therapy', start: "2023-01-29T00:00:00+08:00", end: "2023-01-29T08:00:00+08:00" },
      //   { title: 'e-Counseling', date: '2022-05-05' }
      // ]}
      headerToolbar={{
        // left: 'prev,next today',
        left: 'prev,next',
        center: 'title',
        // right: ''
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }}
    //   eventClick={handleEventClick}
        select={handleDateSelect}
    />
  );
};

export default Calendar;