import { useMemo } from "react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { EditButton, FilterDropdown, useTable } from "@refinedev/antd";
import { useNavigation, useOne } from "@refinedev/core";
import { AuditOutlined, ExportOutlined, PlusCircleOutlined, SearchOutlined, } from "@ant-design/icons";
import { Button, Card, Input, Select, Skeleton, Space, Table, Tag } from "antd";
import { Participants, Text } from "@/components";
import { useDealStagesSelect } from "@/hooks/useDealStagesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";
import { COMPANY_DEALS_TABLE_QUERY, COMPANY_TOTAL_DEALS_AMOUNT_QUERY, } from "./queries";
export const CompanyDealsTable = ({ style }) => {
    const { listUrl } = useNavigation();
    const params = useParams();
    const { tableProps, filters, setFilters } = useTable({
        resource: "deals",
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
                    field: "stage.id",
                    value: "",
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
            gqlQuery: COMPANY_DEALS_TABLE_QUERY,
        },
    });
    const { data: companyData, isLoading: isLoadingCompany } = useOne({
        resource: "companies",
        id: params.id,
        meta: {
            gqlQuery: COMPANY_TOTAL_DEALS_AMOUNT_QUERY,
        },
    });
    const { selectProps: usersSelectProps } = useUsersSelect();
    const { selectProps: dealStagesSelectProps } = useDealStagesSelect();
    const hasData = tableProps.loading
        ? true
        : (tableProps?.dataSource?.length || 0) > 0;
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
    return (React.createElement(Card, { style: style, headStyle: {
            borderBottom: "1px solid #D9D9D9",
            marginBottom: "1px",
        }, bodyStyle: { padding: 0 }, title: React.createElement(Space, { size: "middle" },
            React.createElement(AuditOutlined, null),
            React.createElement(Text, null, "Deals"),
            showResetFilters?.length > 0 && (React.createElement(Button, { size: "small", onClick: () => setFilters([], "replace") }, "Reset filters"))), extra: React.createElement(React.Fragment, null,
            React.createElement(Text, { className: "tertiary" }, "Total deal amount: "),
            isLoadingCompany ? (React.createElement(Skeleton.Input, { active: true, size: "small" })) : (React.createElement(Text, { strong: true }, currencyNumber(companyData?.data.dealsAggregate?.[0]?.sum?.value || 0)))) },
        !hasData && (React.createElement(Space, { direction: "vertical", size: 16, style: {
                padding: 16,
            } },
            React.createElement(Text, null, "No deals yet"),
            React.createElement(Link, { to: listUrl("deals") },
                React.createElement(PlusCircleOutlined, { style: {
                        marginRight: 4,
                    } }),
                " ",
                "Add deals through sales pipeline"))),
        hasData && (React.createElement(Table, { ...tableProps, rowKey: "id", pagination: {
                ...tableProps.pagination,
                showSizeChanger: false,
            } },
            React.createElement(Table.Column, { title: "Deal Title", dataIndex: "title", 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                filterIcon: React.createElement(SearchOutlined, null), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Input, { placeholder: "Search Title" }))) }),
            React.createElement(Table.Column, { title: "Deal amount", dataIndex: "value", sorter: true, render: (_, record) => {
                    return React.createElement(Text, null, currencyNumber(record.value || 0));
                } }),
            React.createElement(Table.Column, { title: "Stage", dataIndex: ["stage", "id"], render: (_, record) => {
                    if (!record.stage)
                        return null;
                    return React.createElement(Tag, null, record.stage.title);
                }, filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Select, { ...dealStagesSelectProps, style: { width: "200px" }, mode: "multiple", placeholder: "Select Stage" }))) }),
            React.createElement(Table.Column, { dataIndex: ["dealOwnerId"], title: "Participants", render: (_, record) => {
                    return (React.createElement(Participants, { userOne: record.dealOwner, userTwo: record.dealContact }));
                }, filterDropdown: (props) => {
                    return (React.createElement(FilterDropdown, { ...props },
                        React.createElement(Select, { style: { width: "200px" }, placeholder: "Select Sales Owner", ...usersSelectProps })));
                } }),
            React.createElement(Table.Column, { dataIndex: "id", width: 48, render: (value) => {
                    return (React.createElement(EditButton, { recordItemId: value, hideText: true, size: "small", resource: "deals", 
                        // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                        icon: React.createElement(ExportOutlined, null) }));
                } })))));
};
