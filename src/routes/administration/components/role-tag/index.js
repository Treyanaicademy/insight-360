import React from "react";
import { CrownOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Tag } from "antd";
export const RoleTag = ({ role }) => {
    const variants = {
        ADMIN: {
            color: "red",
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(CrownOutlined, null),
        },
        SALES_INTERN: {
            color: "blue",
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(UserOutlined, null),
        },
        SALES_PERSON: {
            color: "geekblue",
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(UserOutlined, null),
        },
        SALES_MANAGER: {
            color: "cyan",
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(StarOutlined, null),
        },
    };
    const text = role.replace("_", " ").toLowerCase();
    return (React.createElement(Tag, { style: {
            textTransform: "capitalize",
        }, color: variants[role].color, icon: variants[role].icon }, text));
};
