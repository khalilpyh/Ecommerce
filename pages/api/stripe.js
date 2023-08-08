import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      //set up params
      const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: "shr_1NcchLHQKL4WytxP4Zs4OO5Q" },
          { shipping_rate: "shr_1NccisHQKL4WytxPdGlKtkV4" },
          { shipping_rate: "shr_1NcbgWHQKL4WytxPmkg4ffkX" },
        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref;
          const newImage = img
            .replace(
              "image-",
              "https://cdn.sanity.io/images/0o5zo1jw/production/"
            )
            .replace("-webp", ".webp");

          return {
            price_data: {
              currency: "cad",
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
            tax_rates: ["txr_1NccqjHQKL4WytxPyAPY7sH7"],
          };
        }),
        success_url: `${req.headers.origin}/success`, //direct to success page
        cancel_url: `${req.headers.origin}/`, //direct to home page
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
