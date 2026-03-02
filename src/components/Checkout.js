import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const Checkout = ({ amount, email, name, phone, serviceName }) => {
  const config = {
    public_key: 'FLWPUBK_TEST-YOUR-PUBLIC-KEY-HERE',
    tx_ref: Date.now(),
    amount: amount,
    currency: 'GHS',
    payment_options: 'card,mobilemoneyghana,banktransfer',
    customer: {
      email: email || 'customer@example.com',
      phone_number: phone || '0000000000',
      name: name || 'Customer Name',
    },
    customizations: {
      title: 'OKAWE Media Payment',
      description: `Payment for ${serviceName}`,
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-abstract-spare-parts-concept-logo.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            console.log(response);
            closePaymentModal(); // this will close the modal programmatically
          },
          onClose: () => {},
        });
      }}
    >
      Pay Now
    </button>
  );
};

export default Checkout;
