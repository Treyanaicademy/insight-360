import React, { useState } from "react";
import { ZoomInOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { Text } from "@/components";
export const ActionCell = ({ record }) => {
    const [opened, setOpened] = useState(false);
    const columns = [
        {
            title: "Field",
            dataIndex: "field",
            key: "field",
            render: (value) => React.createElement(Text, { strong: true }, value),
            width: "20%",
        },
        {
            title: "New value",
            dataIndex: "to",
            key: "to",
        },
    ];
    if (record.action === "UPDATE") {
        columns.push({
            title: "Old value",
            dataIndex: "from",
            key: "from",
        });
    }
    return (React.createElement("div", { style: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
        } },
        React.createElement("div", { style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            } },
            React.createElement(Button, { size: "small", 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon: React.createElement(ZoomInOutlined, null), onClick: () => setOpened((prev) => !prev) }, "Details")),
        opened && (React.createElement(Modal, { open: opened, onOk: () => setOpened(false), onCancel: () => setOpened(false), style: { minWidth: "60vw" }, bodyStyle: {
                maxHeight: "500px",
                overflow: "auto",
            } },
            React.createElement(Table, { dataSource: record.changes, pagination: false, rowKey: "field", bordered: true, size: "small", scroll: { x: true }, columns: columns })))));
};
