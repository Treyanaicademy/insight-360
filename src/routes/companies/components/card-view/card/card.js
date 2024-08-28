import { useDelete, useNavigation } from "@refinedev/core";
import { DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Space, Tooltip } from "antd";
import { CustomAvatar, Text } from "@/components";
import { currencyNumber } from "@/utilities";
import { AvatarGroup } from "../../avatar-group";
import { CompanyCardSkeleton } from "./skeleton";
export const CompanyCard = ({ company }) => {
    const { edit } = useNavigation();
    const { mutate } = useDelete();
    if (!company)
        return React.createElement(CompanyCardSkeleton, null);
    const relatedContactAvatars = company?.contacts?.nodes?.map((contact) => {
        return {
            name: contact.name,
            src: contact.avatarUrl,
        };
    });
    return (React.createElement(Card, { size: "small", actions: [
            React.createElement("div", { key: "1", style: {
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
                    React.createElement(AvatarGroup, { size: "small", overlap: true, gap: "4px", avatars: relatedContactAvatars })),
                React.createElement("div", { style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                    } },
                    React.createElement(Text, { size: "xs" }, "Sales owner"),
                    React.createElement(Tooltip, { title: company.salesOwner?.name, key: company.salesOwner?.id },
                        React.createElement(CustomAvatar, { name: company.salesOwner?.name, src: company.salesOwner?.avatarUrl })))),
        ] },
        React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
            } },
            React.createElement(Dropdown, { menu: {
                    items: [
                        {
                            label: "View company",
                            key: "1",
                            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(EyeOutlined, null),
                            onClick: () => {
                                edit("companies", company.id);
                            },
                        },
                        {
                            danger: true,
                            label: "Delete company",
                            key: "2",
                            // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(DeleteOutlined, null),
                            onClick: () => {
                                mutate({
                                    resource: "company",
                                    id: company.id,
                                });
                            },
                        },
                    ],
                }, placement: "bottom", arrow: true },
                React.createElement(Button, { type: "text", shape: "circle", style: {
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }, icon: 
                    // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    React.createElement(MoreOutlined, { style: {
                            transform: "rotate(90deg)",
                        } }) })),
            React.createElement(CustomAvatar, { name: company.name, src: company.avatarUrl, shape: "square", style: {
                    width: "48px",
                    height: "48px",
                } }),
            React.createElement(Text, { strong: true, size: "md", ellipsis: { tooltip: company.name }, style: {
                    marginTop: "12px",
                } }, company.name),
            React.createElement(Space, { direction: "vertical", size: 0, style: {
                    marginTop: "8px",
                    alignItems: "center",
                } },
                React.createElement(Text, { type: "secondary" }, "Open deals amount"),
                React.createElement(Text, { strong: true, size: "md", style: {
                        marginTop: "12px",
                    } }, currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0))))));
};
