import React from "react";
import { DeleteButton, EditButton, FilterDropdown } from "@refinedev/antd";
import { getDefaultFilter, } from "@refinedev/core";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Table } from "antd";
import { CustomAvatar, PaginationTotal, Text } from "@/components";
import { useContactsSelect } from "@/hooks/useContactsSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";
import { AvatarGroup } from "./avatar-group";
export const CompaniesTableView = ({ tableProps, filters }) => {
    const { selectProps: selectPropsUsers } = useUsersSelect();
    const { selectProps: selectPropsContacts } = useContactsSelect();
    return (React.createElement(Table, { ...tableProps, pagination: {
            ...tableProps.pagination,
            pageSizeOptions: ["12", "24", "48", "96"],
            showTotal: (total) => (React.createElement(PaginationTotal, { total: total, entityName: "companies" })),
        }, rowKey: "id" },
        React.createElement(Table.Column, { dataIndex: "name", title: "Company title", defaultFilteredValue: getDefaultFilter("id", filters), 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            filterIcon: React.createElement(SearchOutlined, null), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                React.createElement(Input, { placeholder: "Search Company" }))), render: (_, record) => {
                return (React.createElement(Space, null,
                    React.createElement(CustomAvatar, { shape: "square", name: record.name, src: record.avatarUrl }),
                    React.createElement(Text, { style: {
                            whiteSpace: "nowrap",
                        } }, record.name)));
            } }),
        React.createElement(Table.Column, { dataIndex: ["salesOwner", "id"], title: "Sales Owner", defaultFilteredValue: getDefaultFilter("salesOwner.id", filters), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                React.createElement(Select, { placeholder: "Search Sales owner", style: { width: 220 }, ...selectPropsUsers }))), render: (_, record) => {
                const salesOwner = record.salesOwner;
                return (React.createElement(Space, null,
                    React.createElement(CustomAvatar, { name: salesOwner.name, src: salesOwner.avatarUrl }),
                    React.createElement(Text, { style: {
                            whiteSpace: "nowrap",
                        } }, salesOwner.name)));
            } }),
        React.createElement(Table.Column, { dataIndex: "totalRevenue", title: "Open deals amount", render: (_, company) => {
                return (React.createElement(Text, null, currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)));
            } }),
        React.createElement(Table.Column, { dataIndex: ["contacts", "id"], title: "Related Contacts", defaultFilteredValue: getDefaultFilter("contacts.id", filters, "in"), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                React.createElement(Select, { mode: "multiple", placeholder: "Search related contacts", style: { width: 220 }, ...selectPropsContacts }))), render: (_, record) => {
                const value = record.contacts;
                const avatars = value?.nodes?.map((contact) => {
                    return {
                        name: contact.name,
                        src: contact.avatarUrl,
                    };
                });
                return React.createElement(AvatarGroup, { avatars: avatars, size: "small" });
            } }),
        React.createElement(Table.Column, { fixed: "right", dataIndex: "id", title: "Actions", render: (value) => (React.createElement(Space, null,
                React.createElement(EditButton
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                , { 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(EyeOutlined, null), hideText: true, size: "small", recordItemId: value }),
                React.createElement(DeleteButton, { hideText: true, size: "small", recordItemId: value }))) })));
};
