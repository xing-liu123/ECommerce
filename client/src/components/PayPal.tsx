import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    paypal: any;
  }
}

const PayPal: React.FC = () => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const addPayPalScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=AWALrFBAsVHXZo-Uf5cgWjxm7GPYPbZt6wHZaIKA7QIdnhx0SDZjnvU80BTYEESVcJ8yKs3YbhLb1B0k&currency=USD`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  useEffect(() => {
    if (sdkReady && paypalRef.current) {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any, err: any) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "A table",
                  amount: { currency_code: "USD", value: 650.0 },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log(order);
          },
          onError: async (err: any) => {
            console.log(err);
          },
        })
        .render(paypalRef.current);
    }
  }, [sdkReady]);

  if (!sdkReady) {
    return <div>Loading PayPal...</div>;
  }

  return <div ref={paypalRef}></div>;
};

export default PayPal;
