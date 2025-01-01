import { Button, Skeleton, Spinner } from "@nextui-org/react";
import React from "react";
import { useDeleteCustomerStripeCardMutation } from "../../app/lib/features/payment/paymentApi";
import toast from "react-hot-toast";

const PaymentMethod = ({
  cardsList,
  getCardLogoImage,
  cardsListLoading,
  setOpenCardModal,
  refetchCardList
}) => {
    const [DeleteCustomerStripeCard, isMutationLoading] =
    useDeleteCustomerStripeCardMutation();
    const handleDeleteCard = () => {
      DeleteCustomerStripeCard({card_id: cardsList?.payment_methods[0]?.card_id})
        .unwrap()
        .then((response) => {
          refetchCardList()
          toast.success("Card Deleted Successfully!");
        })
        .catch((error) => {
          // setIsAutoCredit(!data.status);
          if (error?.data?.message) {
            toast.error(error?.data?.message);
          }
        });
    };
  return cardsListLoading ? (
    <Skeleton className="w-full rounded-3xl mb-4">
      <div className="h-[66px] w-full "></div>
    </Skeleton>
  ) : (
    <div
      className="bg-[#1B1B1B] text-white h-[66px] p-8 flex items-center justify-between pr-10"
      style={{ borderRadius: "24px" }}
    >
      <div className="font-bold text-base">Payment Method</div>
      <div className="flex items-center">
        {cardsList?.payment_methods?.length > 0 ? (
          cardsList?.payment_methods?.map((card) => (
            <div className="flex gap-5 items-center">
              {/* <div className="relative">
              <div className="absolute w-5 h-5 rounded-full bg-[#D40101] left-[-30px] top-[-10px]"></div>
              <div className="absolute w-5 h-5 rounded-full bg-[#FE9701] left-[-15px] top-[-10px]"></div>
            </div> */}
              <div className="w-[35px] h-[19px]">
                <img
                  className="h-full w-full object-contain"
                  src={getCardLogoImage(card?.card_type)}
                  alt="Logo"
                />
              </div>
              <div className="mr-10">
                <div className="font-bold text-[10px]">{card?.card_name}</div>
                <div className="text-[10px]">
                  **** **** **** {card?.card_number}
                </div>
              </div>
              <div>
                <Button
                  className={`text-white helvetica-font font-bold w-[70px] !h-[26px] rounded-[4px] bg-transparent border-1
                  hover:bg-[#fff] hover:text-[#000] text-[10px] flex justify-center items-center leading-normal min-w-fit`}
                  onClick={() => handleDeleteCard()}
                >
                  {isMutationLoading.isLoading ? <Spinner size="sm" color="white" /> : 'Delete'}
                  
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex gap-5 items-center">
            <div className="w-14 h-14">
              {/* <img
                className="h-full w-full object-contain"
                src={getCardLogoImage(card?.card_type)}
                alt="Logo"
              /> */}
            </div>
            <div>
              {/* <div>{card?.card_name}</div>
              <div>**** **** **** {card?.card_number}</div> */}
            </div>
            <div>
              <Button
                className={`text-white helvetica-font font-bold w-[70px] !h-[26px] rounded-[4px] bg-transparent border-1
                  hover:bg-[#fff] hover:text-[#000] text-[10px] flex justify-center items-center leading-normal min-w-fit`}
                onClick={() =>
                  setOpenCardModal({
                    open: true,
                    mode: "add",
                    card_details: null,
                  })
                }
              >
                {`Add Card`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
