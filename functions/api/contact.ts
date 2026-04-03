interface Env {
  RESEND_API_KEY: string;
  ADMIN_EMAIL?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_FROM_NAME?: string;
}

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  type: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const adminEmails = (env.ADMIN_EMAIL || 'zw_shjr@163.com,Fanhongmintracy@163.com')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  const fromEmail = env.RESEND_FROM_EMAIL || 'noreply@keencreative.jp';
  const fromName = env.RESEND_FROM_NAME || 'Keen Creative JP';

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'RESEND_API_KEY is not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const formData = await request.formData();

    const data: ContactFormData = {
      name: (formData.get('name') as string) || '',
      company: (formData.get('company') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      type: (formData.get('type') as string) || '',
      message: (formData.get('message') as string) || '',
    };

    if (!data.name || !data.email || !data.type || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please fill in all required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: adminEmails,
        reply_to: data.email,
        subject: `[Website Inquiry] ${data.type} - ${data.name}`,
        html: generateEmailHtml(data),
        text: generateEmailText(data),
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      const errorMessage = getResendErrorMessage(emailResponse.status, errorData);
      console.error('Resend API error:', {
        status: emailResponse.status,
        body: errorData,
      });
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Inquiry submitted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error, please try again later' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

function generateEmailHtml(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; }
    .field { margin-bottom: 16px; }
    .label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1e293b; }
    .message-box { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 8px; }
    .footer { background: #f1f5f9; padding: 16px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Website Inquiry</h1>
      <p>From Keen Creative JP website</p>
    </div>
    <div class="content">
      <div class="field"><div class="label">Type</div><div class="value">${escapeHtml(data.type)}</div></div>
      <div class="field"><div class="label">Name</div><div class="value">${escapeHtml(data.name)}</div></div>
      ${data.company ? `<div class="field"><div class="label">Company</div><div class="value">${escapeHtml(data.company)}</div></div>` : ''}
      <div class="field"><div class="label">Email</div><div class="value">${escapeHtml(data.email)}</div></div>
      ${data.phone ? `<div class="field"><div class="label">Phone/WeChat</div><div class="value">${escapeHtml(data.phone)}</div></div>` : ''}
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">This email was sent automatically by the website contact form.</div>
  </div>
</body>
</html>
  `.trim();
}

function generateEmailText(data: ContactFormData): string {
  return `
New Website Inquiry
===================

Type: ${data.type}
Name: ${data.name}
${data.company ? `Company: ${data.company}\n` : ''}Email: ${data.email}
${data.phone ? `Phone/WeChat: ${data.phone}\n` : ''}
Message:
${data.message}

---
This email was sent automatically by the website contact form.
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getResendErrorMessage(status: number, rawBody: string): string {
  const body = rawBody.toLowerCase();

  if (status === 401 || body.includes('api key') || body.includes('unauthorized')) {
    return 'Email send failed: RESEND_API_KEY is invalid or missing';
  }

  if ((body.includes('domain') && body.includes('verify')) || (body.includes('from address') && body.includes('verify'))) {
    return 'Email send failed: sender domain is not verified in Resend';
  }

  if (body.includes('testing emails') || body.includes('test mode')) {
    return 'Email send failed: Resend test mode only allows sending to the account owner email';
  }

  if (body.includes('invalid') && body.includes('from')) {
    return 'Email send failed: sender address is invalid';
  }

  if (status === 429 || body.includes('rate limit')) {
    return 'Email send failed: rate limited, please retry later';
  }

  return 'Email send failed, please retry later';
}
