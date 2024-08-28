import React, { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { useModal, useOne } from "@refinedev/core";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { CustomAvatar, FullScreenLoading, Text } from "@/components";
import { ProductsServices, QuotesFormModal, ShowDescription, StatusIndicator, } from "../components";
import { QUOTES_GET_QUOTE_QUERY } from "../queries";
import styles from "./index.module.css";
const PdfExport = lazy(() => import("../components/pdf-export"));
export const QuotesShowPage = () => {
    const { visible, show, close } = useModal();
    const params = useParams();
    const { data, isLoading } = useOne({
        resource: "quotes",
        id: params.id,
        liveMode: "off",
        meta: {
            gqlQuery: QUOTES_GET_QUOTE_QUERY,
        },
    });
    if (isLoading || !data?.data) {
        return React.createElement(FullScreenLoading, null);
    }
    const { title, id, status, company, contact, salesOwner } = data?.data ?? {};
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles.container },
            React.createElement(Link, { to: "/quotes" },
                React.createElement(Button, { icon: React.createElement(LeftOutlined, null) }, "Quotes")),
            React.createElement("div", { className: styles.divider }),
            React.createElement("div", { className: styles.title },
                React.createElement(Text, { size: "xl", style: {
                        fontWeight: 500,
                    } }, title),
                React.createElement(Space, null,
                    React.createElement(Suspense, null,
                        React.createElement(PdfExport, null)),
                    React.createElement(Button, { icon: React.createElement(EditOutlined, null), onClick: () => show() }, "Edit"))),
            React.createElement(StatusIndicator, { style: {
                    marginTop: "32px",
                }, id: id, status: status }),
            React.createElement("div", { className: styles.pdf },
                React.createElement("div", { className: styles.pdfQuoteInfo },
                    React.createElement(CustomAvatar, { name: company?.name, src: company?.avatarUrl, shape: "square", style: {
                            width: "64px",
                            height: "64px",
                        } }),
                    React.createElement("div", { className: styles.companyInfo },
                        React.createElement("div", { className: styles.company },
                            React.createElement(Text, { strong: true }, company.name),
                            React.createElement(Text, null, company.country),
                            React.createElement(Text, null, company.website))),
                    React.createElement("div", { className: styles.userInfo },
                        React.createElement("div", { className: styles.user },
                            React.createElement(Text, { strong: true }, "Prepared by:"),
                            React.createElement(Text, null, salesOwner.name)),
                        React.createElement("div", { className: styles.user },
                            React.createElement(Text, { strong: true }, "Prepared for:"),
                            React.createElement(Text, null, contact.name)))),
                React.createElement("div", { className: styles.divider }),
                React.createElement(ProductsServices, null),
                React.createElement("div", { className: styles.divider }),
                React.createElement(ShowDescription, null))),
        visible && (React.createElement(QuotesFormModal, { action: "edit", redirect: false, onCancel: () => close(), onMutationSuccess: () => close() }))));
};
