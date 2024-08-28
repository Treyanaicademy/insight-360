import { useMemo } from "react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { FilterDropdown, ShowButton, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { ContainerOutlined, ExportOutlined, PlusCircleOutlined, SearchOutlined, } from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";
import { Participants, QuoteStatusTag, Text } from "@/components";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";
import { COMPANY_QUOTES_TABLE_QUERY } from "./queries";
export const CompanyQuotesTable = ({ style }) => {
    const { listUrl } = useNavigation();
    const params = useParams();
    const { tableProps, filters, setFilters } = useTable({
        resource: "quotes",
        syncWithLocation: false,
        sorters: {
            initial: [
                {
                    field: "updatedAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "title",
                    value: "",
                    operator: "contains",
                },
                {
                    field: "status",
                    value: undefined,
                    operator: "in",
                },
            ],
            permanent: [
                {
                    field: "company.id",
                    operator: "eq",
                    value: params.id,
                },
            ],
        },
        meta: {
            gqlQuery: COMPANY_QUOTES_TABLE_QUERY,
        },
    });
    const { selectProps: selectPropsUsers } = useUsersSelect();
    const showResetFilters = useMemo(() => {
        return filters?.filter((filter) => {
            if ("field" in filter && filter.field === "company.id") {
                return false;
            }
            if (!filter.value) {
                return false;
            }
            return true;
        });
    }, [filters]);
    const hasData = (tableProps?.dataSource?.length || 0) > 0;
    return (React.createElement(Card, { style: style, headStyle: {
            borderBottom: "1px solid #D9D9D9",
            marginBottom: "1px",
        }, bodyStyle: { padding: 0 }, title: React.createElement(Space, { size: "middle" },
            React.createElement(ContainerOutlined, null),
            React.createElement(Text, null, "Quotes"),
            showResetFilters?.length > 0 && (React.createElement(Button, { size: "small", onClick: () => setFilters([], "replace") }, "Reset filters"))) },
        !hasData && (React.createElement(Space, { direction: "vertical", size: 16, style: {
                padding: 16,
            } },
            React.createElement(Text, null, "No quotes yet"),
            React.createElement(Link, { to: listUrl("quotes") },
                React.createElement(PlusCircleOutlined, { style: {
                        marginRight: 4,
                    } }),
                " ",
                "Add quotes"))),
        hasData && (React.createElement(Table, { ...tableProps, rowKey: "id", pagination: {
                ...tableProps.pagination,
                showSizeChanger: false,
            } },
            React.createElement(Table.Column, { title: "Quote Title", dataIndex: "title", 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                filterIcon: React.createElement(SearchOutlined, null), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Input, { placeholder: "Search Title" }))) }),
            React.createElement(Table.Column, { title: "Total amount", dataIndex: "total", sorter: true, render: (_, record) => {
                    return React.createElement(Text, null, currencyNumber(record.total || 0));
                } }),
            React.createElement(Table.Column, { title: "Stage", dataIndex: "status", render: (_, record) => {
                    if (!record.status)
                        return null;
                    return React.createElement(QuoteStatusTag, { status: record.status });
                }, filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Select, { style: { width: "200px" }, mode: "multiple", placeholder: "Select Stage", options: statusOptions }))) }),
            React.createElement(Table.Column, { dataIndex: ["salesOwner", "id"], title: "Participants", render: (_, record) => {
                    return (React.createElement(Participants, { userOne: record.salesOwner, userTwo: record.contact }));
                }, filterDropdown: (props) => {
                    return (React.createElement(FilterDropdown, { ...props },
                        React.createElement(Select, { style: { width: "200px" }, placeholder: "Select Sales Owner", ...selectPropsUsers })));
                } }),
            React.createElement(Table.Column, { dataIndex: "id", width: 48, render: (value) => {
                    return (React.createElement(ShowButton, { recordItemId: value, hideText: true, size: "small", resource: "contacts", 
                        // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                        icon: React.createElement(ExportOutlined, null) }));
                } }))),
        " "));
};
const statusOptions = [
    {
        label: "Draft",
        value: "DRAFT",
    },
    {
        label: "Sent",
        value: "SENT",
    },
    {
        label: "Accepted",
        value: "ACCEPTED",
    },
];
