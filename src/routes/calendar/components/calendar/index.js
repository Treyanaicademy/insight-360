import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useList } from "@refinedev/core";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Grid, Radio } from "antd";
import dayjs from "dayjs";
import { Text } from "@/components";
import styles from "./index.module.css";
import { CALENDAR_EVENTS_QUERY } from "./queries";
const FullCalendarWrapper = lazy(() => import("./full-calendar"));
export const Calendar = ({ categoryId, onClickEvent, }) => {
    const [calendarView, setCalendarView] = useState("dayGridMonth");
    const calendarRef = useRef(null);
    const [title, setTitle] = useState(calendarRef.current?.getApi().view.title);
    const { md } = Grid.useBreakpoint();
    useEffect(() => {
        calendarRef.current?.getApi().changeView(calendarView);
    }, [calendarView]);
    useEffect(() => {
        if (md) {
            setCalendarView("dayGridMonth");
        }
        else {
            setCalendarView("listMonth");
        }
    }, [md]);
    const { data } = useList({
        pagination: {
            mode: "off",
        },
        filters: [
            {
                field: "category.id",
                operator: "in",
                value: categoryId?.length ? categoryId : undefined,
            },
        ],
        meta: {
            gqlQuery: CALENDAR_EVENTS_QUERY,
        },
    });
    const events = (data?.data ?? []).map(({ id, title, startDate, endDate, color }) => ({
        id: id,
        title: title,
        start: startDate,
        end: endDate,
        color: color,
        allDay: dayjs(endDate).utc().diff(dayjs(startDate).utc(), "hours") >= 23,
    }));
    return (React.createElement(Card, null,
        React.createElement("div", { className: styles.calendar_header },
            React.createElement("div", { className: styles.actions },
                React.createElement(Button, { onClick: () => {
                        calendarRef.current?.getApi().prev();
                    }, shape: "circle", 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(LeftOutlined, null) }),
                React.createElement(Button, { onClick: () => {
                        calendarRef.current?.getApi().next();
                    }, shape: "circle", 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(RightOutlined, null) }),
                React.createElement(Text, { className: styles.title, size: "lg" }, title)),
            React.createElement(Radio.Group, { value: calendarView },
                [
                    {
                        label: "Month",
                        desktopView: "dayGridMonth",
                        mobileView: "listMonth",
                    },
                    {
                        label: "Week",
                        desktopView: "timeGridWeek",
                        mobileView: "listWeek",
                    },
                    {
                        label: "Day",
                        desktopView: "timeGridDay",
                        mobileView: "listDay",
                    },
                ].map(({ label, desktopView, mobileView }) => {
                    const view = md ? desktopView : mobileView;
                    return (React.createElement(Radio.Button, { key: label, value: view, onClick: () => {
                            setCalendarView(view);
                        } }, label));
                }),
                md && (React.createElement(Radio.Button, { value: "listMonth", onClick: () => {
                        setCalendarView("listMonth");
                    } }, "List")))),
        React.createElement(Suspense, null,
            React.createElement(FullCalendarWrapper, { calendarRef, events, onClickEvent, setTitle }))));
};
