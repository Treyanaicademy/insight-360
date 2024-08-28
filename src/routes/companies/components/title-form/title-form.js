import React, { useState } from "react";
import { useForm } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";
import { CustomAvatar, SelectOptionWithAvatar, Text } from "@/components";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { getNameInitials } from "@/utilities";
import { COMPANY_TITLE_FORM_MUTATION, COMPANY_TITLE_QUERY } from "./queries";
import styles from "./title-form.module.css";
export const CompanyTitleForm = () => {
    const { formProps, query: queryResult, onFinish, } = useForm({
        redirect: false,
        meta: {
            gqlMutation: COMPANY_TITLE_FORM_MUTATION,
            gqlQuery: COMPANY_TITLE_QUERY,
        },
    });
    const company = queryResult?.data?.data;
    const loading = queryResult?.isLoading;
    return (React.createElement(Form, { ...formProps },
        React.createElement(Space, { size: 16 },
            React.createElement(CustomAvatar, { size: "large", shape: "square", src: company?.avatarUrl, name: getNameInitials(company?.name || ""), style: {
                    width: 96,
                    height: 96,
                    fontSize: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                } }),
            React.createElement(Space, { direction: "vertical", size: 0 },
                React.createElement(Form.Item, { name: "name", required: true, noStyle: true },
                    React.createElement(TitleInput, { loading: loading, onChange: (value) => {
                            return onFinish?.({
                                name: value,
                            });
                        } })),
                React.createElement(SalesOwnerInput, { salesOwner: company?.salesOwner, loading: loading, onChange: (value) => {
                        onFinish?.({
                            salesOwnerId: value,
                        });
                    } })))));
};
const TitleInput = ({ value, onChange, loading, }) => {
    return (React.createElement(Text, { className: styles.title, size: "xl", strong: true, editable: {
            onChange,
            triggerType: ["text", "icon"],
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(EditOutlined, { className: styles.titleEditIcon }),
        } }, loading ? (React.createElement(Skeleton.Input, { size: "small", style: { width: 200 }, active: true })) : (value)));
};
const SalesOwnerInput = ({ salesOwner, onChange, loading, }) => {
    const [isEdit, setIsEdit] = useState(false);
    const { selectProps, queryResult } = useUsersSelect();
    return (React.createElement("div", { className: styles.salesOwnerInput, role: "button", onClick: () => {
            setIsEdit(true);
        } },
        React.createElement(Text, { type: "secondary", style: {
                marginRight: 12,
            } }, "Sales Owner:"),
        loading && React.createElement(Skeleton.Input, { size: "small", style: { width: 120 }, active: true }),
        !isEdit && !loading && (React.createElement(React.Fragment, null,
            React.createElement(CustomAvatar, { size: "small", src: salesOwner?.avatarUrl, style: {
                    marginRight: 4,
                } }),
            React.createElement(Text, null, salesOwner?.name),
            React.createElement(Button, { type: "link", 
                // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                icon: React.createElement(EditOutlined, { className: styles.salesOwnerInputEditIcon }) }))),
        isEdit && !loading && (React.createElement(Form.Item, { name: ["salesOwner", "id"], noStyle: true },
            React.createElement(Select, { ...selectProps, defaultOpen: true, autoFocus: true, onDropdownVisibleChange: (open) => {
                    if (!open) {
                        setIsEdit(false);
                    }
                }, onClick: (e) => {
                    e.stopPropagation();
                }, onChange: (value, option) => {
                    onChange?.(value);
                    selectProps.onChange?.(value, option);
                }, options: queryResult.data?.data?.map(({ id, name, avatarUrl }) => ({
                    value: id,
                    label: (React.createElement(SelectOptionWithAvatar, { name: name, avatarUrl: avatarUrl ?? undefined })),
                })) ?? [] })))));
};
