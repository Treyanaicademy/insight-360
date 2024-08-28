import React from "react";
import { useSelect } from "@refinedev/antd";
import { Checkbox, Col, ColorPicker, DatePicker, Form, Input, Row, Select, TimePicker, } from "antd";
import dayjs from "dayjs";
import { EVENT_CATEGORIES_QUERY } from "@/graphql/queries";
import { useUsersSelect } from "@/hooks/useUsersSelect";
const { RangePicker } = DatePicker;
export const CalendarForm = ({ form, formProps, isAllDayEvent = false, setIsAllDayEvent, }) => {
    const { selectProps: categorySelectProps } = useSelect({
        resource: "eventCategories",
        meta: {
            gqlQuery: EVENT_CATEGORIES_QUERY,
        },
    });
    const { selectProps: userSelectProps } = useUsersSelect();
    const rangeDate = form.getFieldsValue().rangeDate;
    const date = form.getFieldsValue().date;
    return (React.createElement(Form, { layout: "vertical", form: form, ...formProps },
        React.createElement(Form.Item, { label: "Title", name: "title", rules: [
                {
                    required: true,
                },
            ] },
            React.createElement(Input, null)),
        React.createElement(Form.Item, { label: "Description", name: "description", rules: [
                {
                    required: true,
                },
            ] },
            React.createElement(Input.TextArea, null)),
        React.createElement(Form.Item, { label: "Date & Time", rules: [
                {
                    required: true,
                },
            ] },
            React.createElement("div", { style: {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                } },
                React.createElement("div", { style: { flex: 1, width: 80 } },
                    React.createElement(Checkbox, { checked: isAllDayEvent, onChange: (e) => setIsAllDayEvent(e.target.checked) }, "All Day")),
                isAllDayEvent ? (React.createElement(Form.Item, { name: "rangeDate", rules: [
                        {
                            required: true,
                        },
                    ], noStyle: true },
                    React.createElement(RangePicker, { style: {
                            width: 416,
                        }, format: "YYYY/MM/DD", defaultValue: [dayjs(date), dayjs(date)] }))) : (React.createElement("div", { style: {
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                    } },
                    React.createElement(Form.Item, { name: "date", rules: [
                            {
                                required: true,
                            },
                        ], noStyle: true },
                        React.createElement(DatePicker, { style: {
                                width: "160px",
                            }, format: "YYYY/MM/DD", defaultValue: dayjs(rangeDate ? rangeDate[0] : undefined) })),
                    React.createElement(Form.Item, { name: "time", rules: [
                            {
                                required: true,
                            },
                        ], noStyle: true },
                        React.createElement(TimePicker.RangePicker, { style: {
                                width: 240,
                            }, format: "HH:mm", minuteStep: 15 })))))),
        React.createElement(Row, { gutter: [32, 32] },
            React.createElement(Col, { span: 12 },
                React.createElement(Form.Item, { label: "Category", name: "categoryId", rules: [
                        {
                            required: true,
                        },
                    ] },
                    React.createElement(Select, { ...categorySelectProps }))),
            React.createElement(Col, { span: 12 },
                React.createElement(Form.Item, { label: "Color", name: "color", rules: [
                        {
                            required: true,
                        },
                    ], initialValue: "#1677FF" },
                    React.createElement(ColorPicker, { defaultValue: "#1677FF", panelRender: (_, { components: { Presets } }) => React.createElement(Presets, null), presets: [
                            {
                                label: "Recommended",
                                colors: [
                                    "#F5222D",
                                    "#FA8C16",
                                    "#8BBB11",
                                    "#52C41A",
                                    "#13A8A8",
                                    "#1677FF",
                                    "#2F54EB",
                                    "#722ED1",
                                    "#EB2F96",
                                ],
                            },
                        ] })))),
        React.createElement(Form.Item, { label: "Invite participants", name: "participantIds", rules: [
                {
                    required: true,
                },
            ] },
            React.createElement(Select, { mode: "multiple", allowClear: true, ...userSelectProps }))));
};
