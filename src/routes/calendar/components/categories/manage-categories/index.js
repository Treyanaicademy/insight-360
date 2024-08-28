import React from "react";
import { useCreateMany, useDelete, useList } from "@refinedev/core";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Popconfirm } from "antd";
import { Text } from "@/components";
import { EVENT_CATEGORIES_QUERY } from "@/graphql/queries";
import styles from "./index.module.css";
import { CALENDAR_CREATE_EVENT_CATEGORIES_MUTATION } from "./queries";
export const CalendarManageCategories = ({ saveSuccces, ...rest }) => {
    const [form] = Form.useForm();
    const { mutate: createManyMutation } = useCreateMany({
        resource: "eventCategories",
        meta: {
            gqlMutation: CALENDAR_CREATE_EVENT_CATEGORIES_MUTATION,
        },
        successNotification: () => ({
            key: "event-category-create",
            message: "Successfully created categories",
            description: "Successful",
            type: "success",
        }),
        mutationOptions: {
            onSuccess: () => {
                saveSuccces?.();
                form.resetFields();
            },
        },
    });
    const { mutate: deleteMutation } = useDelete();
    const { data } = useList({
        resource: "eventCategories",
        meta: {
            gqlQuery: EVENT_CATEGORIES_QUERY,
        },
    });
    return (React.createElement(Modal, { ...rest, title: "Manage Categories", okText: "Save", destroyOnClose: true, bodyStyle: { paddingTop: "1rem" }, okButtonProps: {
            onClick: () => {
                form.submit();
            },
        } },
        React.createElement("div", { className: styles.container },
            data?.data.map((category) => (React.createElement("div", { key: category.id, className: styles.category },
                React.createElement(Text, { className: styles.title }, category.title),
                React.createElement(Popconfirm, { title: "Delete the category", description: "Are you sure to delete this category?", okText: "Yes", cancelText: "No", onConfirm: () => {
                        deleteMutation({
                            resource: "eventCategories",
                            id: category.id,
                            successNotification: () => ({
                                key: "event-category-delete",
                                message: "Successfully deleted category",
                                description: "Successful",
                                type: "success",
                            }),
                        });
                    } },
                    React.createElement(Button, { type: "text", 
                        // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                        icon: React.createElement(DeleteOutlined, { className: "tertiary" }) }))))),
            React.createElement(Form, { form: form, onFinish: (formValues) => {
                    if (!formValues?.title || formValues.title.length === 0) {
                        return saveSuccces?.();
                    }
                    // remove undefined values
                    formValues.title = formValues.title.filter((title) => title !== undefined);
                    const values = formValues.title.map((title) => ({
                        title,
                    }));
                    createManyMutation({
                        values,
                    });
                } },
                React.createElement(Form.List, { name: "title" }, (fields, { add, remove }) => (React.createElement(React.Fragment, null,
                    fields.map((field) => (React.createElement("div", { key: field.key, className: styles.category },
                        React.createElement(Form.Item, { required: false, noStyle: true },
                            React.createElement(Form.Item, { ...field, noStyle: true },
                                React.createElement(Input, { className: styles["new-category-input"], placeholder: "Please enter category title", bordered: false }))),
                        React.createElement(Button, { type: "text", onClick: () => {
                                remove(field.name);
                            }, 
                            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(DeleteOutlined, { className: "tertiary" }) })))),
                    React.createElement("div", { className: styles.category },
                        React.createElement(Button, { type: "link", 
                            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                            icon: React.createElement(PlusOutlined, null), onClick: () => {
                                add();
                            }, className: styles["new-category-button"] }, "Add category")))))))));
};
