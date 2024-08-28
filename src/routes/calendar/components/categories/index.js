import React from "react";
import { useModal } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { FlagOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Skeleton, theme } from "antd";
import { Text } from "@/components";
import { EVENT_CATEGORIES_QUERY } from "@/graphql/queries";
import styles from "./index.module.css";
import { CalendarManageCategories } from "./manage-categories";
export const CalendarCategories = ({ onChange, ...rest }) => {
    const { token } = theme.useToken();
    const { modalProps, show, close } = useModal();
    const { data, isLoading } = useList({
        resource: "eventCategories",
        meta: {
            gqlQuery: EVENT_CATEGORIES_QUERY,
        },
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Card, { title: React.createElement("span", null,
                React.createElement(FlagOutlined, { style: { color: token.colorPrimary } }),
                React.createElement(Text, { size: "sm", style: { marginLeft: ".5rem" } }, "Categories")), extra: React.createElement(Button, { shape: "circle", onClick: () => show(), 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon: React.createElement(SettingOutlined, null) }), bodyStyle: {
                padding: "0.5rem 1rem",
            }, ...rest },
            React.createElement("div", { className: styles.container },
                isLoading && (React.createElement(Skeleton, { loading: isLoading, active: true, paragraph: {
                        rows: 3,
                        width: 200,
                    } })),
                data?.data.map((item) => (React.createElement("div", { key: item.id, className: styles.category },
                    React.createElement(Checkbox, { className: styles.checkbox, value: item.id, onChange: onChange },
                        React.createElement(Text, null, item.title))))))),
        React.createElement(CalendarManageCategories, { ...modalProps, saveSuccces: () => close() })));
};
