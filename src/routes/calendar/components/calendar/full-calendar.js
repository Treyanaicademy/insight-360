import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
const FullCalendarWrapper = ({ calendarRef, events, onClickEvent, setTitle, }) => {
    return (React.createElement(FullCalendar, { ref: calendarRef, plugins: [dayGridPlugin, timeGridPlugin, listPlugin], initialView: "dayGridMonth", events: events, eventTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
        }, eventClick: ({ event }) => {
            onClickEvent?.(events.find(({ id }) => id === event.id));
        }, datesSet: ({ view }) => {
            setTitle(view.title);
        }, headerToolbar: false, timeZone: "UTC", height: 600 }));
};
export default FullCalendarWrapper;
