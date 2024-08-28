import React from "react";
import { Card, Skeleton, Space } from "antd";
import { Text } from "@/components";
export const CompanyCardSkeleton = () => {
    return (React.createElement(Card, { size: "small", actions: [
            React.createElement("div", { key: 1, style: {
                    width: "100%",
                    height: "60px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "0 16px",
                } },
                React.createElement("div", { style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "6px",
                    } },
                    React.createElement(Text, { size: "xs" }, "Related contacts"),
                    React.createElement(Space, { size: 4 },
                        React.createElement(Skeleton.Avatar, { active: true, shape: "circle", size: "small" }),
                        React.createElement(Skeleton.Avatar, { active: true, shape: "circle", size: "small" }),
                        React.createElement(Skeleton.Avatar, { active: true, shape: "circle", size: "small" }))),
                React.createElement("div", { style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                    } },
                    React.createElement(Text, { size: "xs" }, "Sales owner"),
                    React.createElement(Space, { size: 4 },
                        React.createElement(Skeleton.Avatar, { active: true, shape: "circle", size: "small" })))),
        ] },
        React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
            } },
            React.createElement(Skeleton.Avatar, { active: true, shape: "square", style: {
                    width: "48px",
                    height: "48px",
                    borderRadius: "4px",
                } }),
            React.createElement(Skeleton.Input, { active: true, style: {
                    width: "200px",
                    height: "16px",
                    marginTop: "16px",
                } }),
            React.createElement(Space, { direction: "vertical", size: 0, style: {
                    marginBottom: "6px",
                    alignItems: "center",
                } },
                React.createElement(Skeleton.Input, { active: true, style: {
                        height: "16px",
                        marginTop: "12px",
                    } }),
                React.createElement(Skeleton.Input, { active: true, style: {
                        height: "16px",
                        marginTop: "8px",
                    } })))));
};
