import React, { useEffect, useState } from "react";

import { useForm } from "@refinedev/antd";
import { useNavigation, useResource } from "@refinedev/core";
import type { GetFields } from "@refinedev/nestjs-query";

import { Modal } from "antd";
import dayjs from "dayjs";

import type { UpdateEventMutation } from "../../graphql/types";
import { CalendarForm } from "./components";
import { CALENDAR_UPDATE_EVENT_MUTATION } from "./queries";

// Define the types used for the form values
type Event = GetFields<UpdateEventMutation>;

interface FormValues {
  rangeDate?: [dayjs.Dayjs, dayjs.Dayjs];
  date?: dayjs.Dayjs;
  time?: [dayjs.Dayjs, dayjs.Dayjs];
  color?: { toHex: () => string } | string;
  categoryId?: string;
  participantIds?: string[];
  [key: string]: any; // For other values not explicitly typed
}

export const CalendarEditPage: React.FC = () => {
  const [isAllDayEvent, setIsAllDayEvent] = useState(false);
  const { id } = useResource();
  const { list } = useNavigation();

  const {
    formProps,
    saveButtonProps,
    form,
    onFinish,
    query: queryResult,
  } = useForm<Event>({
    action: "edit",
    id,
    queryOptions: {
      enabled: true,
    },
    meta: {
      gqlMutation: CALENDAR_UPDATE_EVENT_MUTATION,
    },
  });

  useEffect(() => {
    const startDate = queryResult?.data?.data.startDate;
    const endDate = queryResult?.data?.data.endDate;

    // Ensure startDate and endDate are valid before proceeding
    if (startDate && endDate) {
      const utcStartDate = dayjs(startDate).utc();
      const utcEndDate = dayjs(endDate).utc();

      form.setFieldsValue({
        categoryId: queryResult?.data?.data.category.id,
        participantIds: queryResult?.data?.data.participants.map(
          (participant) => participant.id,
        ),
      });

      // If more than 24 hours, set as all-day event
      if (utcEndDate.diff(utcStartDate, "hours") >= 24) {
        setIsAllDayEvent(true);
        form.setFieldsValue({
          rangeDate: [utcStartDate, utcEndDate],
        });
      } else {
        form.setFieldsValue({
          date: utcStartDate,
          time: [utcStartDate, utcEndDate],
        });
      }
    }
  }, [queryResult?.data]);

  const handleOnFinish = async (values: FormValues) => {
    const { rangeDate, date, time, color, ...otherValues } = values;

    let startDate = dayjs();
    let endDate = dayjs();

    if (rangeDate) {
      startDate = rangeDate[0].utc().startOf("day");
      endDate = rangeDate[1].utc().endOf("day");
    } else if (date && time) {
      startDate = date
        .utc()
        .set("hour", time[0].hour())
        .set("minute", time[0].minute())
        .set("second", 0);

      endDate = date
        .utc()
        .set("hour", time[1].hour())
        .set("minute", time[1].minute())
        .set("second", 0);
    }

    await onFinish({
      ...otherValues,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      color: typeof color === "object" ? `#${color.toHex()}` : color,
    });
  };

  return (
    <Modal
      title="Edit Event"
      open
      onCancel={() => {
        list("events");
      }}
      okButtonProps={{
        ...saveButtonProps,
      }}
      okText="Save"
      width={560}
    >
      <CalendarForm
        isAllDayEvent={isAllDayEvent}
        setIsAllDayEvent={setIsAllDayEvent}
        form={form}
        formProps={{
          ...formProps,
          onFinish: handleOnFinish,
        }}
      />
    </Modal>
  );
};