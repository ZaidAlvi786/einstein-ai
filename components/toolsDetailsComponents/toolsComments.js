import React, { useState } from "react";
import { useFormik } from "formik";
import { Avatar, Button, Skeleton, Textarea } from "@nextui-org/react";
import {
  useAddCommentOnToolMutation,
  useGetAllToolCommentsQuery,
  useGetUserQuery,
} from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";

const ToolsComments = ({ tool_id }) => {
  const auth = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);
  const [AddCommentOnTool] = useAddCommentOnToolMutation();
  const { data: getAllToolCommentsData, isLoading: getAllToolCommentsLoading } =
    useGetAllToolCommentsQuery(
      { tool_id, page_number: 1, per_page: 100 },
      { skip: !tool_id }
    );
  const { data: getUserData, isLoading: getUserLoading } = useGetUserQuery(
    { email: auth?.user?.email },
    { skip: !(auth?.user?.email && auth?.user?.fullname) }
  );

  const addToolsCommentFormik = useFormik({
    initialValues: { tool_id: tool_id ?? "", comment: "" },
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);

      const data = { ...values, comment: values?.comment?.trim() };

      AddCommentOnTool(data)
        .unwrap()
        .then((response) => {
          resetForm();
          toast.success(response.message);
        })
        .catch((error) => {
          toast.error(
            (error?.data?.message ?? error?.message) || "Something went wrong"
          );
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <>
      <div className="relative">
        <Textarea
          classNames={{
            inputWrapper:
              "!bg-transparent border border-[#3C3C3C] !outline-0 pt-3",
            input: "caret-[#fff] pt-1",
            innerWrapper: "mb-[42px]",
          }}
          placeholder="Add a comment"
          name="comment"
          value={addToolsCommentFormik.values.comment}
          onChange={addToolsCommentFormik.handleChange}
          onBlur={addToolsCommentFormik.handleBlur}
          onKeyDown={(e) => {
            if (e?.key === "Enter") {
              addToolsCommentFormik.handleSubmit();
            }
          }}
          startContent={
            <>
              {getUserLoading ? (
                <Skeleton className="rounded-full h-8 w-8" />
              ) : (
                <Avatar
                  src={getUserData?.data?.profile_picture_url}
                  showFallback={true}
                  alt="profile_picture_url"
                  className="w-8 h-8 cursor-pointer"
                  radius="full"
                  fallback={
                    <Image
                      src={"/svg/user.svg"}
                      alt="profile-pic"
                      width={14}
                      height={17}
                    />
                  }
                />
              )}
            </>
          }
          endContent={
            <div
              className={`absolute bottom-2.5 right-2.5 ${
                addToolsCommentFormik?.values?.comment?.trim()?.length <= 0 ||
                isSubmitting
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              {auth?.user?.email && auth?.user?.fullname ? (
                <Button
                  className={`text-base h-9 rounded-full font-helvetica font-bold py-1.5 px-5 bg-[#FFF] text-[#545454] ${
                    addToolsCommentFormik?.values?.comment?.trim()?.length >
                      0 && "bg-[#0A84FF] text-white"
                  }`}
                  onPress={addToolsCommentFormik.handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={
                    addToolsCommentFormik?.values?.comment?.trim()?.length <= 0
                  }
                >
                  {isSubmitting ? "Posting" : "Post"}
                </Button>
              ) : (
                <Button
                  as={Link}
                  href="/signin"
                  className={`text-base h-9 rounded-full font-helvetica font-bold py-1.5 px-5 bg-[#FFF] text-[#545454]`}
                >
                  {"Post"}
                </Button>
              )}
            </div>
          }
        />
      </div>
      <div id="comments" className="mb-6">
        <p className="text-white font-bold font-helvetica text-xs mt-6 ml-2">
          {getAllToolCommentsData?.total_comments > 0 &&
            getAllToolCommentsData?.total_comments}{" "}
          comments
        </p>
      </div>
      {getAllToolCommentsData?.comments?.length <= 0 && (
        <div className="flex justify-center mb-12">
          <p className="text-white">No Comments Found.</p>
        </div>
      )}
      {getAllToolCommentsData?.comments?.map((item, index) => (
        <div key={index} className="flex gap-[14px] mb-4">
          <Avatar
            src={item?.profile_picture_url}
            showFallback={true}
            alt="profile_picture_url"
            className="w-8 h-8 cursor-pointer"
            radius="full"
            fallback={
              <Image
                src={"/svg/user.svg"}
                alt="profile-pic"
                width={14}
                height={17}
              />
            }
          />
          <div className="border-b border-[#3C3C3C] min-[1700px]:pb-[33px] pb-4 w-full">
            <div className="flex gap-2 items-center mb-4">
              <p className="text-white font-helvetica font-medium text-sm">
                {item?.full_name}
              </p>
              {/* <p className="text-[#646464] font-helvetica font-medium text-xs">
                @Tamer
              </p> */}
              <p className="text-[#646464] font-helvetica font-medium text-xs">
                {" "}
                &#9679; {moment(item?.created_at).fromNow()}
              </p>
            </div>
            <p className="text-white text-xs font-helvetica">{item?.comment}</p>
          </div>
        </div>
      ))}
      {getAllToolCommentsLoading &&
        Array.from({ length: 3 }, (_, i) => i + 1).map((_, key) => (
          <Skeleton key={key} className="rounded-md mb-6">
            <div className="h-20 w-full" />
          </Skeleton>
        ))}
      <ToastService />
    </>
  );
};

export default ToolsComments;
