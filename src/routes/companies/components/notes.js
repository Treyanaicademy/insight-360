import React from "react";
import { useParams } from "react-router-dom";
import { DeleteButton, useForm } from "@refinedev/antd";
import { useGetIdentity, useInvalidate, useList, useParsed, } from "@refinedev/core";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import dayjs from "dayjs";
import { CustomAvatar, Text, TextIcon } from "@/components";
import { COMPANY_COMPANY_NOTES_QUERY, COMPANY_CREATE_COMPANY_NOTE_MUTATION, COMPANY_UPDATE_COMPANY_NOTE_MUTATION, } from "./queries";
export const CompanyNotes = ({ style }) => {
    return (React.createElement(Card, { bodyStyle: {
            padding: "0",
        }, headStyle: {
            borderBottom: "1px solid #D9D9D9",
        }, title: React.createElement(Space, { size: 16 },
            React.createElement(TextIcon, { style: {
                    width: "24px",
                    height: "24px",
                } }),
            React.createElement(Text, null, "Notes")), style: style },
        React.createElement(CompanyNoteForm, null),
        React.createElement(CompanyNoteList, null)));
};
export const CompanyNoteForm = () => {
    const { id: companyId } = useParsed();
    const { data: me } = useGetIdentity();
    const { formProps, onFinish, form, formLoading } = useForm({
        action: "create",
        resource: "companyNotes",
        queryOptions: {
            enabled: false,
        },
        redirect: false,
        mutationMode: "optimistic",
        successNotification: () => ({
            key: "company-note",
            message: "Successfully added note",
            description: "Successful",
            type: "success",
        }),
        meta: {
            gqlMutation: COMPANY_CREATE_COMPANY_NOTE_MUTATION,
        },
    });
    const handleOnFinish = async (values) => {
        if (!companyId) {
            return;
        }
        const note = values.note.trim();
        if (!note) {
            return;
        }
        try {
            await onFinish({
                ...values,
                companyId: companyId,
            });
            form.resetFields();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) { }
    };
    return (React.createElement("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "1rem",
            borderBottom: "1px solid #F0F0F0",
        } },
        React.createElement(CustomAvatar, { style: { flexShrink: 0 }, name: me?.name, src: me?.avatarUrl }),
        React.createElement(Form, { ...formProps, style: { width: "100%" }, onFinish: handleOnFinish },
            React.createElement(Form.Item, { name: "note", noStyle: true, rules: [
                    {
                        required: true,
                        transform(value) {
                            return value?.trim();
                        },
                        message: "Please enter a note",
                    },
                ] },
                React.createElement(Input, { placeholder: "Add your note", style: { backgroundColor: "#fff" }, 
                    // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                    addonAfter: formLoading && React.createElement(LoadingOutlined, null) })))));
};
export const CompanyNoteList = () => {
    const params = useParams();
    const invalidate = useInvalidate();
    const { data: notes } = useList({
        resource: "companyNotes",
        sorters: [
            {
                field: "updatedAt",
                order: "desc",
            },
        ],
        filters: [{ field: "company.id", operator: "eq", value: params.id }],
        meta: {
            gqlQuery: COMPANY_COMPANY_NOTES_QUERY,
        },
    });
    const { formProps, setId, id, saveButtonProps } = useForm({
        resource: "companyNotes",
        action: "edit",
        queryOptions: {
            enabled: false,
        },
        mutationMode: "optimistic",
        onMutationSuccess: () => {
            setId(undefined);
            invalidate({
                invalidates: ["list"],
                resource: "companyNotes",
            });
        },
        successNotification: () => ({
            key: "company-update-note",
            message: "Successfully updated note",
            description: "Successful",
            type: "success",
        }),
        meta: {
            gqlMutation: COMPANY_UPDATE_COMPANY_NOTE_MUTATION,
        },
    });
    const { data: me } = useGetIdentity();
    return (React.createElement(Space, { size: 16, direction: "vertical", style: {
            borderRadius: "8px",
            backgroundColor: "#FAFAFA",
            padding: "1rem",
            width: "100%",
        } }, notes?.data?.map((item) => {
        const isMe = me?.id === item.createdBy.id;
        return (React.createElement("div", { key: item.id, style: { display: "flex", gap: "12px" } },
            React.createElement(CustomAvatar, { style: { flexShrink: 0 }, name: item.createdBy.name, src: item.createdBy.avatarUrl }),
            React.createElement("div", { style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                } },
                React.createElement("div", { style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    } },
                    React.createElement(Text, { style: { fontWeight: 500 } }, item.createdBy.name),
                    React.createElement(Text, { size: "xs", style: { color: "#000000a6" } }, dayjs(item.createdAt).format("MMMM D, YYYY - h:ma"))),
                id === item.id ? (React.createElement(Form, { ...formProps, initialValues: { note: item.note } },
                    React.createElement(Form.Item, { name: "note", rules: [
                            {
                                required: true,
                                transform(value) {
                                    return value?.trim();
                                },
                                message: "Please enter a note",
                            },
                        ] },
                        React.createElement(Input.TextArea, { autoFocus: true, required: true, minLength: 1, style: {
                                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px 0px rgba(0, 0, 0, 0.02)",
                                backgroundColor: "#fff",
                                width: "100%",
                            } })))) : (React.createElement(Typography.Paragraph, { style: {
                        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 2px 4px 0px rgba(0, 0, 0, 0.02)",
                        background: "#fff",
                        borderRadius: "6px",
                        padding: "8px",
                        marginBottom: 0,
                    }, ellipsis: { rows: 3, expandable: true } }, item.note)),
                isMe && !id && (React.createElement(Space, { size: 16 },
                    React.createElement(Typography.Link, { type: "secondary", style: {
                            fontSize: "12px",
                        }, onClick: () => setId(item.id) }, "Edit"),
                    React.createElement(DeleteButton, { resource: "companyNotes", recordItemId: item.id, size: "small", type: "link", successNotification: () => ({
                            key: "company-delete-note",
                            message: "Successfully deleted note",
                            description: "Successful",
                            type: "success",
                        }), icon: null, className: "ant-typography secondary", style: {
                            fontSize: "12px",
                        } }))),
                id === item.id && (React.createElement(Space, null,
                    React.createElement(Button, { size: "small", onClick: () => setId(undefined) }, "Cancel"),
                    React.createElement(Button, { size: "small", type: "primary", ...saveButtonProps }, "Save"))))));
    })));
};
