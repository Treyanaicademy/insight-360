import React, { useState } from "react";
import { useDelete, useNavigation, useShow, useUpdate } from "@refinedev/core";
import { CloseOutlined, DeleteOutlined, EditOutlined, GlobalOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, ShopOutlined, } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Popconfirm, Select, Space, Spin, Typography, } from "antd";
import dayjs from "dayjs";
import { CustomAvatar, SelectOptionWithAvatar, SingleElementForm, Text, TextIcon, } from "@/components";
import { TimezoneEnum } from "@/enums";
import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { ContactComment, ContactStatus } from "../components";
import styles from "./index.module.css";
import { CONTACT_SHOW_QUERY } from "./queries";
const timezoneOptions = Object.keys(TimezoneEnum).map((key) => ({
    label: TimezoneEnum[key],
    value: TimezoneEnum[key],
}));
export const ContactShowPage = () => {
    const [activeForm, setActiveForm] = useState();
    const { list } = useNavigation();
    const { query: queryResult } = useShow({
        meta: {
            gqlQuery: CONTACT_SHOW_QUERY,
        },
    });
    const { data, isLoading, isError } = queryResult;
    const { mutate } = useUpdate({
        resource: "contacts",
        successNotification: false,
        id: data?.data?.id,
    });
    const { mutate: deleteMutation } = useDelete();
    const { selectProps: companySelectProps, queryResult: companySelectQueryResult, } = useCompaniesSelect();
    const { selectProps: usersSelectProps, queryResult: usersSelectQueryResult } = useUsersSelect();
    const closeModal = () => {
        setActiveForm(undefined);
        list("contacts");
    };
    if (isError) {
        closeModal();
        return null;
    }
    if (isLoading) {
        return (React.createElement(Drawer, { open: true, width: 756, bodyStyle: {
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            } },
            React.createElement(Spin, null)));
    }
    const { id, name, email, jobTitle, phone, timezone, avatarUrl, company, createdAt, salesOwner, } = data?.data ?? {};
    return (React.createElement(Drawer, { open: true, onClose: () => closeModal(), width: 756, bodyStyle: { background: "#f5f5f5", padding: 0 }, headerStyle: { display: "none" } },
        React.createElement("div", { className: styles.header },
            React.createElement(Button, { type: "text", 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon: React.createElement(CloseOutlined, null), onClick: () => closeModal() })),
        React.createElement("div", { className: styles.container },
            React.createElement("div", { className: styles.name },
                React.createElement(CustomAvatar, { style: {
                        marginRight: "1rem",
                        flexShrink: 0,
                        fontSize: "40px",
                    }, size: 96, src: avatarUrl, name: name }),
                React.createElement(Typography.Title, { level: 3, style: { padding: 0, margin: 0, width: "100%" }, className: styles.title, editable: {
                        onChange(value) {
                            mutate({
                                values: {
                                    name: value,
                                },
                            });
                        },
                        triggerType: ["text", "icon"],
                        // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                        icon: React.createElement(EditOutlined, { className: styles.titleEditIcon }),
                    } }, name)),
            React.createElement("div", { className: styles.form },
                React.createElement(SingleElementForm
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                , { 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(MailOutlined, { className: "tertiary" }), state: activeForm && activeForm === "email"
                        ? "form"
                        : email
                            ? "view"
                            : "empty", itemProps: {
                        name: "email",
                        label: "Email",
                    }, view: React.createElement(Text, null, email), onClick: () => setActiveForm("email"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
                    React.createElement(Input, { defaultValue: email })),
                React.createElement(SingleElementForm
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                , { 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(ShopOutlined, { className: "tertiary" }), state: activeForm && activeForm === "companyId"
                        ? "form"
                        : company.id
                            ? "view"
                            : "empty", itemProps: {
                        name: "companyId",
                        label: "Company",
                    }, view: React.createElement(Space, null,
                        React.createElement(CustomAvatar, { src: company.avatarUrl, name: company.name }),
                        React.createElement(Text, null, company.name)), onClick: () => setActiveForm("companyId"), onCancel: () => setActiveForm(undefined), onUpdate: () => {
                        setActiveForm(undefined);
                    }, extra: React.createElement(Form.Item, { name: "salesOwnerId", label: "Sales Owner", labelCol: {
                            style: {
                                marginTop: "0.8rem",
                            },
                        } },
                        React.createElement(Select, { style: {
                                width: "100%",
                            }, defaultValue: {
                                label: salesOwner.name,
                                value: salesOwner.id,
                            }, ...usersSelectProps, options: usersSelectQueryResult.data?.data?.map(({ id, name, avatarUrl }) => ({
                                value: id,
                                label: (React.createElement(SelectOptionWithAvatar, { name: name, avatarUrl: avatarUrl ?? undefined })),
                            })) ?? [] })) },
                    React.createElement(Select, { style: { width: "100%" }, defaultValue: {
                            label: data.data.company.name,
                            value: data.data.company.id,
                        }, ...companySelectProps, options: companySelectQueryResult.data?.data?.map(({ id, name, avatarUrl }) => ({
                            value: id,
                            label: (React.createElement(SelectOptionWithAvatar, { name: name, avatarUrl: avatarUrl ?? undefined })),
                        })) ?? [] })),
                React.createElement(SingleElementForm
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                , { 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(IdcardOutlined, { className: "tertiary" }), state: activeForm && activeForm === "jobTitle"
                        ? "form"
                        : jobTitle
                            ? "view"
                            : "empty", itemProps: {
                        name: "jobTitle",
                        label: "Title",
                    }, view: React.createElement(Text, null, jobTitle), onClick: () => setActiveForm("jobTitle"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
                    React.createElement(Input, { defaultValue: jobTitle || "" })),
                React.createElement(SingleElementForm
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                , { 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(PhoneOutlined, { className: "tertiary" }), state: activeForm && activeForm === "phone"
                        ? "form"
                        : phone
                            ? "view"
                            : "empty", itemProps: {
                        name: "phone",
                        label: "Phone",
                    }, view: React.createElement(Text, null, phone), onClick: () => setActiveForm("phone"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
                    React.createElement(Input, { defaultValue: phone || "" })),
                React.createElement(SingleElementForm, { style: { borderBottom: "none" }, 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    icon: React.createElement(GlobalOutlined, { className: "tertiary" }), state: activeForm && activeForm === "timezone"
                        ? "form"
                        : timezone
                            ? "view"
                            : "empty", itemProps: {
                        name: "timezone",
                        label: "TimezoneEnum",
                    }, view: React.createElement(Text, null, timezone), onClick: () => setActiveForm("timezone"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
                    React.createElement(Select, { style: { width: "100%" }, options: timezoneOptions, defaultValue: data.data.timezone }))),
            React.createElement("div", { className: styles.stage },
                React.createElement(ContactStatus, { contact: data.data })),
            React.createElement(Card, { title: React.createElement(React.Fragment, null,
                    React.createElement(TextIcon, null),
                    React.createElement(Text, { style: { marginLeft: ".8rem" } }, "Notes")), bodyStyle: {
                    padding: 0,
                } },
                React.createElement(ContactComment, null)),
            React.createElement("div", { className: styles.actions },
                React.createElement(Text, { className: "ant-text tertiary" },
                    "Created on: ",
                    dayjs(createdAt).format("MMMM DD, YYYY")),
                React.createElement(Popconfirm, { title: "Delete the contact", description: "Are you sure to delete this contact?", onConfirm: () => {
                        deleteMutation({
                            id,
                            resource: "contacts",
                        }, {
                            onSuccess: () => closeModal(),
                        });
                    }, okText: "Yes", cancelText: "No" },
                    React.createElement(Button, { type: "link", danger: true, icon: React.createElement(DeleteOutlined, null) }, "Delete Contact"))))));
};
