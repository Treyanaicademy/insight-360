import React, { useState } from "react";
import { useShow } from "@refinedev/core";
import { ApiOutlined, BankOutlined, ColumnWidthOutlined, DollarOutlined, EnvironmentOutlined, ShopOutlined, } from "@ant-design/icons";
import { Card, Input, InputNumber, Select, Space } from "antd";
import { SingleElementForm, Text } from "@/components";
import { currencyNumber } from "@/utilities";
import { COMPANY_INFO_QUERY } from "./queries";
export const CompanyInfoForm = () => {
    const [activeForm, setActiveForm] = useState();
    const { query: queryResult } = useShow({
        meta: {
            gqlQuery: COMPANY_INFO_QUERY,
        },
    });
    const data = queryResult?.data?.data;
    const { totalRevenue, industry, companySize, businessType, country, website, } = data || {};
    const getActiveForm = (args) => {
        const { formName } = args;
        if (activeForm === formName) {
            return "form";
        }
        if (!data?.[formName]) {
            return "empty";
        }
        return "view";
    };
    const loading = queryResult?.isLoading;
    return (React.createElement(Card, { title: React.createElement(Space, { size: 15 },
            React.createElement(ShopOutlined, { className: "sm" }),
            React.createElement(Text, null, "Company info")), headStyle: {
            padding: "1rem",
        }, bodyStyle: {
            padding: "0",
        }, style: {
            maxWidth: "500px",
        } },
        React.createElement(SingleElementForm, { loading: loading, style: {
                padding: "0.5rem 1rem",
            }, 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(ColumnWidthOutlined, { className: "tertiary" }), state: getActiveForm({ formName: "companySize" }), itemProps: {
                name: "companySize",
                label: "Company size",
            }, view: React.createElement(Text, null, companySize), onClick: () => setActiveForm("companySize"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
            React.createElement(Select, { autoFocus: true, defaultValue: companySize, options: companySizeOptions, style: {
                    width: "100%",
                } })),
        React.createElement(SingleElementForm, { loading: loading, style: {
                padding: "0.5rem 1rem",
            }, 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(DollarOutlined, { className: "tertiary" }), state: getActiveForm({ formName: "totalRevenue" }), itemProps: {
                name: "totalRevenue",
                label: "Total revenue",
            }, view: React.createElement(Text, null, currencyNumber(totalRevenue || 0)), onClick: () => setActiveForm("totalRevenue"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
            React.createElement(InputNumber, { autoFocus: true, addonBefore: "$", min: 0, placeholder: "0,00", defaultValue: totalRevenue || 0, formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") })),
        React.createElement(SingleElementForm, { loading: loading, style: {
                padding: "0.5rem 1rem",
            }, 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(BankOutlined, { className: "tertiary" }), state: getActiveForm({ formName: "industry" }), itemProps: {
                name: "industry",
                label: "Industry",
            }, view: React.createElement(Text, null, industry), onClick: () => setActiveForm("industry"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
            React.createElement(Select, { autoFocus: true, defaultValue: industry, options: industryOptions, style: {
                    width: "100%",
                } })),
        React.createElement(SingleElementForm, { loading: loading, style: {
                padding: "0.5rem 1rem",
            }, 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(ApiOutlined, { className: "tertiary" }), state: getActiveForm({ formName: "businessType" }), itemProps: {
                name: "businessType",
                label: "Business type",
            }, view: React.createElement(Text, null, businessType), onClick: () => setActiveForm("businessType"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
            React.createElement(Select, { autoFocus: true, defaultValue: businessType, options: businessTypeOptions, style: {
                    width: "100%",
                } })),
        React.createElement(SingleElementForm, { loading: loading, style: {
                padding: "0.5rem 1rem",
            }, 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(EnvironmentOutlined, { className: "tertiary" }), state: getActiveForm({ formName: "country" }), itemProps: {
                name: "country",
                label: "Country",
            }, view: React.createElement(Text, null, country), onClick: () => setActiveForm("country"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
            React.createElement(Input, { autoFocus: true, defaultValue: country || "", placeholder: "Country", style: {
                    width: "100%",
                } })),
        React.createElement(SingleElementForm, { loading: loading, style: {
                padding: "0.5rem 1rem",
            }, 
            // ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            icon: React.createElement(EnvironmentOutlined, { className: "tertiary" }), state: getActiveForm({ formName: "website" }), itemProps: {
                name: "website",
                label: "Website",
            }, view: React.createElement(Text, null, website), onClick: () => setActiveForm("website"), onUpdate: () => setActiveForm(undefined), onCancel: () => setActiveForm(undefined) },
            React.createElement(Input, { autoFocus: true, defaultValue: website || "", placeholder: "Website", style: {
                    width: "100%",
                } }))));
};
const companySizeOptions = [
    {
        label: "Enterprise",
        value: "ENTERPRISE",
    },
    {
        label: "Large",
        value: "LARGE",
    },
    {
        label: "Medium",
        value: "MEDIUM",
    },
    {
        label: "Small",
        value: "SMALL",
    },
];
const industryOptions = [
    { label: "Aerospace", value: "AEROSPACE" },
    { label: "Agriculture", value: "AGRICULTURE" },
    { label: "Automotive", value: "AUTOMOTIVE" },
    { label: "Chemicals", value: "CHEMICALS" },
    { label: "Construction", value: "CONSTRUCTION" },
    { label: "Defense", value: "DEFENSE" },
    { label: "Education", value: "EDUCATION" },
    { label: "Energy", value: "ENERGY" },
    { label: "Financial Services", value: "FINANCIAL_SERVICES" },
    { label: "Food and Beverage", value: "FOOD_AND_BEVERAGE" },
    { label: "Government", value: "GOVERNMENT" },
    { label: "Healthcare", value: "HEALTHCARE" },
    { label: "Hospitality", value: "HOSPITALITY" },
    { label: "Industrial Manufacturing", value: "INDUSTRIAL_MANUFACTURING" },
    { label: "Insurance", value: "INSURANCE" },
    { label: "Life Sciences", value: "LIFE_SCIENCES" },
    { label: "Logistics", value: "LOGISTICS" },
    { label: "Media", value: "MEDIA" },
    { label: "Mining", value: "MINING" },
    { label: "Nonprofit", value: "NONPROFIT" },
    { label: "Other", value: "OTHER" },
    { label: "Pharmaceuticals", value: "PHARMACEUTICALS" },
    { label: "Professional Services", value: "PROFESSIONAL_SERVICES" },
    { label: "Real Estate", value: "REAL_ESTATE" },
    { label: "Retail", value: "RETAIL" },
    { label: "Technology", value: "TECHNOLOGY" },
    { label: "Telecommunications", value: "TELECOMMUNICATIONS" },
    { label: "Transportation", value: "TRANSPORTATION" },
    { label: "Utilities", value: "UTILITIES" },
];
const businessTypeOptions = [
    {
        label: "B2B",
        value: "B2B",
    },
    {
        label: "B2C",
        value: "B2C",
    },
    {
        label: "B2G",
        value: "B2G",
    },
];
