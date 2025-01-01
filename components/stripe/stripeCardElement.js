"use client"

import React, { useMemo } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import MailIcon from "@/app/assets/svg/mail.svg";
import { CalendarDaysIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useStripe } from '@stripe/react-stripe-js';
import { useElements } from '@stripe/react-stripe-js';

export const Stripe_Card_Element = ({ isOpen, onOpenChange = () => { }, size = "3xl", isChange }) => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: "https://example.com/order/123/complete" },
        });


        if (result.error) {
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };


    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={size}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-white">{`Payment`}</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-2 gap-4">
                                <form onSubmit={handleSubmit}>
                                    <PaymentElement />
                                    <button disabled={!stripe}>Submit</button>
                                </form>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>{`Close`}</Button>
                            <Button color="success" onPress={onClose}>{`Pay`}</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Stripe_Card_Element from './Stripe_Card_Element'; // Update with the correct path
import { useEffect } from 'react';

// Load your Stripe public key

export const StripeWrapper = (props) => {
    const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        fetch('http://localhost:4242/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ amount: 5000 }),
        })
            .then((response) => response.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.error('Error:', error));
    }, []);
    
    return (
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
            <Stripe_Card_Element {...props} />
        </Elements>
    );
};
