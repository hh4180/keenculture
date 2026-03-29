interface Env {
  RESEND_API_KEY: string;
  ADMIN_EMAIL?: string;
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
  const adminEmail = env.ADMIN_EMAIL || 'Fanhongmintracy@163.com';

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData = await request.formData();
    
    const data: ContactFormData = {
      name: (formData.get('name') as string) || '',
      company: (formData.get('company') as string) || '',
      email: (formData.get('email') as string) || '',
      phone: (formData.get('phone') as string) || '',
      type: (formData.get('type') as string) || '',
      message: (formData.get('message') as string) || '',
    };

    // Validate required fields
    if (!data.name || !data.email || !data.type || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: '请填写所有必填字段' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ success: false, error: '请输入有效的邮箱地址' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Keen Creative JP <noreply@keencreative.jp>',
        to: [adminEmail],
        reply_to: data.email,
        subject: `[网站咨询] ${data.type} - ${data.name}`,
        html: generateEmailHtml(data),
        text: generateEmailText(data),
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ success: false, error: '邮件发送失败，请稍后重试' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: '咨询已提交，我们将尽快与您联系' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ success: false, error: '服务器错误，请稍后重试' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
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
    .header h1 { margin: 0; font-size: 20px; }
    .header p { margin: 8px 0 0; opacity: 0.8; font-size: 14px; }
    .content { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; }
    .field { margin-bottom: 16px; }
    .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1e293b; }
    .message-box { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 8px; }
    .footer { background: #f1f5f9; padding: 16px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>新的网站咨询</h1>
      <p>来自 Keen Creative JP 官网</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">咨询类型</div>
        <div class="value"><span class="badge">${escapeHtml(data.type)}</span></div>
      </div>
      <div class="field">
        <div class="label">姓名</div>
        <div class="value">${escapeHtml(data.name)}</div>
      </div>
      ${data.company ? `
      <div class="field">
        <div class="label">公司</div>
        <div class="value">${escapeHtml(data.company)}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">邮箱</div>
        <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
      </div>
      ${data.phone ? `
      <div class="field">
        <div class="label">电话/微信</div>
        <div class="value">${escapeHtml(data.phone)}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">咨询内容</div>
        <div class="message-box">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      此邮件由网站表单自动发送，请直接回复此邮件联系客户。
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateEmailText(data: ContactFormData): string {
  return `
新的网站咨询
================

咨询类型: ${data.type}
姓名: ${data.name}
${data.company ? `公司: ${data.company}\n` : ''}邮箱: ${data.email}
${data.phone ? `电话/微信: ${data.phone}\n` : ''}
咨询内容:
${data.message}

---
此邮件由 Keen Creative JP 官网表单自动发送
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
