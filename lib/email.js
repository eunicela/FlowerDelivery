import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'orders@piazzawholesale.com';

export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderNumber,
  flowerColor,
  deliveryDate,
  deliveryAddress,
  totalCents,
  confirmationUrl
}) {
  const flowerColorDisplay = flowerColor.charAt(0).toUpperCase() + flowerColor.slice(1);
  const formattedDate = new Date(deliveryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const totalFormatted = `$${(totalCents / 100).toFixed(2)}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Georgia, serif; background-color: #f5f0e8; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background-color: #8B0000; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-family: cursive, Georgia, serif; font-size: 32px;">
                Thank You!
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <p style="color: #3a3a3a; font-size: 16px; margin-bottom: 20px;">
                Hi ${customerName},
              </p>

              <p style="color: #3a3a3a; font-size: 16px; margin-bottom: 30px;">
                Your Valentine's flower order has been confirmed! We're preparing your beautiful bouquet with care.
              </p>

              <!-- Order Details Box -->
              <div style="background-color: #f5f0e8; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h2 style="color: #8B0000; margin: 0 0 15px 0; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                  Order Details
                </h2>

                <table style="width: 100%; font-size: 14px; color: #3a3a3a;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Order Number:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Bouquet:</td>
                    <td style="padding: 8px 0; text-align: right;">${flowerColorDisplay} Roses</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Delivery Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Delivery Address:</td>
                    <td style="padding: 8px 0; text-align: right;">${deliveryAddress}</td>
                  </tr>
                  <tr style="border-top: 1px solid #ddd;">
                    <td style="padding: 12px 0 0 0; color: #666; font-weight: bold;">Total:</td>
                    <td style="padding: 12px 0 0 0; text-align: right; font-weight: bold; color: #8B0000;">${totalFormatted}</td>
                  </tr>
                </table>
              </div>

              <!-- Track Order Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${confirmationUrl}" style="display: inline-block; background-color: #8B0000; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-size: 16px;">
                  Track Your Order
                </a>
              </div>

              <p style="color: #666; font-size: 14px; text-align: center;">
                Questions? Contact us at<br>
                <a href="mailto:Eflowerwholesale@gmail.com" style="color: #8B0000;">Eflowerwholesale@gmail.com</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f5f0e8; padding: 20px; text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                Piazza Wholesale Flowers<br>
                Made with love for Valentine's Day
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }

  console.log('Confirmation email sent:', data?.id);
  return data;
}
