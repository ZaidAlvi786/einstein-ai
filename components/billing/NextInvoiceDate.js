"use client";
import { useAuth } from "@/app/authContext/auth";
import { useGetNextInvoiceDateQuery } from "@/app/lib/features/payment/paymentApi";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import moment from "moment";

const NextInvoiceDate = () => {
  const auth = useAuth();
  const { data, isFetching, isError } = useGetNextInvoiceDateQuery({ user_id: auth?.user?.userID }, { skip: !auth?.user?.userID });

  return (
    <Card className="planning-card shadow-billingCard rounded-3xl h-fit">
      <CardBody className="p-0 py-[30px] px-[22px] flex justify-center items-center" as={"section"}>
        {isFetching ? (
          <div className="flex justify-center items-center w-full">
            <Spinner color="default" />
          </div>
        ) : isError ? (
          <div className="text-base font-normal">Not Subscribe Any Plan</div>
        ) : (
          <div className="flex justify-between font-helvetica w-full">
            <p className="text-base font-bold">Next Invoice</p>
            <p className="text-sm font-bold">
              {moment(data?.data?.next_invoice_date).format("DD/MM/YYYY")}
            </p>
            <p className="text-sm font-bold">
              ${data?.data?.subscription_cost ?? 0}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default NextInvoiceDate;
