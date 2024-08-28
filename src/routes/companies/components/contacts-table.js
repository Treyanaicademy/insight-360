import { useMemo } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { FilterDropdown, SaveButton, ShowButton, useTable, } from "@refinedev/antd";
import { useCreateMany, useOne } from "@refinedev/core";
import { DeleteOutlined, ExportOutlined, MailOutlined, PhoneOutlined, PlusCircleOutlined, SearchOutlined, TeamOutlined, UserOutlined, } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, Space, Table, } from "antd";
import { ContactStatusTag, CustomAvatar, Text } from "@/components";
import { COMPANY_CONTACTS_GET_COMPANY_QUERY, COMPANY_CONTACTS_TABLE_QUERY, } from "./queries";
export const CompanyContactsTable = () => {
    const params = useParams();
    const { tableProps, filters, setFilters } = useTable({
        resource: "contacts",
        syncWithLocation: false,
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "jobTitle",
                    value: "",
                    operator: "contains",
                },
                {
                    field: "name",
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
            gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
        },
    });
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
    return (React.createElement(Card, { headStyle: {
            borderBottom: "1px solid #D9D9D9",
            marginBottom: "1px",
        }, bodyStyle: { padding: 0 }, title: React.createElement(Space, { size: "middle" },
            React.createElement(TeamOutlined, null),
            React.createElement(Text, null, "Contacts"),
            showResetFilters?.length > 0 && (React.createElement(Button, { size: "small", onClick: () => setFilters([], "replace") }, "Reset filters"))), actions: [React.createElement(ContactForm, { key: "1" })], extra: React.createElement(React.Fragment, null,
            React.createElement(Text, { className: "tertiary" }, "Total contacts: "),
            React.createElement(Text, { strong: true }, tableProps?.pagination !== false && tableProps.pagination?.total)) },
        !hasData && (React.createElement("div", { style: {
                padding: 16,
                borderBottom: "1px solid #D9D9D9",
            } },
            React.createElement(Text, null, "No contacts yet"))),
        hasData && (React.createElement(Table, { ...tableProps, rowKey: "id", pagination: {
                ...tableProps.pagination,
                showSizeChanger: false,
            } },
            React.createElement(Table.Column, { title: "Name", dataIndex: "name", render: (_, record) => {
                    return (React.createElement(Space, null,
                        React.createElement(CustomAvatar, { name: record.name, src: record.avatarUrl }),
                        React.createElement(Text, { style: {
                                whiteSpace: "nowrap",
                            } }, record.name)));
                }, 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                filterIcon: React.createElement(SearchOutlined, null), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Input, { placeholder: "Search Name" }))) }),
            React.createElement(Table.Column, { title: "Title", dataIndex: "jobTitle", 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                filterIcon: React.createElement(SearchOutlined, null), filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Input, { placeholder: "Search Title" }))) }),
            React.createElement(Table.Column, { title: "Stage", dataIndex: "status", render: (_, record) => {
                    return React.createElement(ContactStatusTag, { status: record.status });
                }, filterDropdown: (props) => (React.createElement(FilterDropdown, { ...props },
                    React.createElement(Select, { style: { width: "200px" }, mode: "multiple", placeholder: "Select Stage", options: statusOptions }))) }),
            React.createElement(Table.Column, { dataIndex: "id", width: 112, render: (value, record) => {
                    return (React.createElement(Space, null,
                        React.createElement(Button, { size: "small", href: `mailto:${record.email}`, 
                            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(MailOutlined, null) }),
                        React.createElement(Button, { size: "small", href: `tel:${record.phone}`, 
                            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(PhoneOutlined, null) }),
                        React.createElement(ShowButton, { hideText: true, recordItemId: value, size: "small", resource: "contacts", 
                            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(ExportOutlined, null) })));
                } })))));
};
const ContactForm = () => {
    const { id = "" } = useParams();
    const { data } = useOne({
        id,
        resource: "companies",
        meta: {
            gqlQuery: COMPANY_CONTACTS_GET_COMPANY_QUERY,
        },
    });
    const [form] = Form.useForm();
    const contacts = Form.useWatch("contacts", form);
    const { mutateAsync } = useCreateMany({
        resource: "contacts",
        successNotification: false,
    });
    const handleOnFinish = async (args) => {
        form.validateFields();
        const contacts = args.contacts.map((contact) => ({
            ...contact,
            companyId: id,
            salesOwnerId: data?.data.salesOwner?.id || "",
        }));
        await mutateAsync({
            values: contacts,
        });
        form.resetFields();
    };
    const { hasContacts } = useMemo(() => {
        const hasContacts = contacts?.length > 0;
        return {
            hasContacts,
        };
    }, [contacts]);
    return (React.createElement(Form, { form: form, onFinish: handleOnFinish },
        React.createElement(Form.List, { name: "contacts" }, (fields, { add, remove }) => {
            return (React.createElement("div", { style: {
                    display: "flex",
                    alignItems: "flex-start ",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "4px 16px",
                } },
                fields.map(({ key, name, ...restField }) => {
                    return (React.createElement(Row, { key: key, gutter: 12, align: "top", style: {
                            width: "100%",
                        } },
                        React.createElement(Col, { span: 11 },
                            React.createElement(Form.Item, { ...restField, style: {
                                    marginBottom: 0,
                                }, rules: [
                                    {
                                        required: true,
                                        message: "Please enter contact name",
                                    },
                                ], name: [name, "name"] },
                                React.createElement(Input
                                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                                , { 
                                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                                    addonBefore: React.createElement(UserOutlined, null), placeholder: "Contact name" }))),
                        React.createElement(Col, { span: 11 },
                            React.createElement(Form.Item, { required: true, style: {
                                    marginBottom: 0,
                                }, rules: [
                                    {
                                        required: true,
                                        message: "Please enter contact e-mail",
                                    },
                                ], name: [name, "email"] },
                                React.createElement(Input
                                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                                , { 
                                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                                    addonBefore: React.createElement(MailOutlined, null), placeholder: "Contact email" }))),
                        React.createElement(Col, { span: 2 },
                            React.createElement(Button
                            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            , { 
                                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                                icon: React.createElement(DeleteOutlined, null), onClick: () => remove(name) }))));
                }),
                React.createElement(Button, { type: "link", 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(PlusCircleOutlined, null), onClick: () => add(), style: {
                        marginBottom: hasContacts ? 16 : 0,
                    } }, "Add new contact")));
        }),
        hasContacts && (React.createElement("div", { style: {
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                padding: "16px",
                borderTop: "1px solid #D9D9D9",
            } },
            React.createElement(Button, { size: "large", type: "default", onClick: () => {
                    form.resetFields();
                } }, "Cancel"),
            React.createElement(SaveButton, { size: "large", icon: undefined, onClick: () => form.submit() })))));
};
const statusOptions = [
    {
        label: "New",
        value: "NEW",
    },
    {
        label: "Qualified",
        value: "QUALIFIED",
    },
    {
        label: "Unqualified",
        value: "UNQUALIFIED",
    },
    {
        label: "Won",
        value: "WON",
    },
    {
        label: "Negotiation",
        value: "NEGOTIATION",
    },
    {
        label: "Lost",
        value: "LOST",
    },
    {
        label: "Interested",
        value: "INTERESTED",
    },
    {
        label: "Contacted",
        value: "CONTACTED",
    },
    {
        label: "Churned",
        value: "CHURNED",
    },
];
