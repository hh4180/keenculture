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
        JSON.stringify({ success: false, error: 'RESEND_API_KEY 鏈厤缃? }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
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

    // Validate required fields
    if (!data.name || !data.email || !data.type || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: '璇峰～鍐欐墍鏈夊繀濉瓧娈? }),
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
        JSON.stringify({ success: false, error: '璇疯緭鍏ユ湁鏁堢殑閭鍦板潃' }),
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
        from: `${fromName} <${fromEmail}>`,
        to: adminEmails,
        reply_to: data.email,
        subject: `[缃戠珯鍜ㄨ] ${data.type} - ${data.name}`,
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
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: '鍜ㄨ宸叉彁浜わ紝鎴戜滑灏嗗敖蹇笌鎮ㄨ仈绯? }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ success: false, error: '鏈嶅姟鍣ㄩ敊璇紝璇风◢鍚庨噸璇? }),
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
      <h1>鏂扮殑缃戠珯鍜ㄨ</h1>
      <p>鏉ヨ嚜 Keen Creative JP 瀹樼綉</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">鍜ㄨ绫诲瀷</div>
        <div class="value"><span class="badge">${escapeHtml(data.type)}</span></div>
      </div>
      <div class="field">
        <div class="label">濮撳悕</div>
        <div class="value">${escapeHtml(data.name)}</div>
      </div>
      ${data.company ? `
      <div class="field">
        <div class="label">鍏徃</div>
        <div class="value">${escapeHtml(data.company)}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">閭</div>
        <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
      </div>
      ${data.phone ? `
      <div class="field">
        <div class="label">鐢佃瘽/寰俊</div>
        <div class="value">${escapeHtml(data.phone)}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">鍜ㄨ鍐呭</div>
        <div class="message-box">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      姝ら偖浠剁敱缃戠珯琛ㄥ崟鑷姩鍙戦€侊紝璇风洿鎺ュ洖澶嶆閭欢鑱旂郴瀹㈡埛銆?
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateEmailText(data: ContactFormData): string {
  return `
鏂扮殑缃戠珯鍜ㄨ
================

鍜ㄨ绫诲瀷: ${data.type}
濮撳悕: ${data.name}
${data.company ? `鍏徃: ${data.company}\n` : ''}閭: ${data.email}
${data.phone ? `鐢佃瘽/寰俊: ${data.phone}\n` : ''}
鍜ㄨ鍐呭:
${data.message}

---
姝ら偖浠剁敱 Keen Creative JP 瀹樼綉琛ㄥ崟鑷姩鍙戦€?
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
    return '邮件发送失败：RESEND_API_KEY 无效或未配置';
  }

  if (
    (body.includes('domain') && body.includes('verify')) ||
    (body.includes('from address') && body.includes('verify'))
  ) {
    return '邮件发送失败：发件域名未验证，请先在 Resend 完成域名验证';
  }

  if (body.includes('testing emails') || body.includes('test mode')) {
    return '邮件发送失败：当前为 Resend 测试模式，仅可发送到账号所有者邮箱';
  }

  if (body.includes('invalid') && body.includes('from')) {
    return '邮件发送失败：发件邮箱格式或配置不正确';
  }

  if (status === 429 || body.includes('rate limit')) {
    return '邮件发送失败：请求过于频繁，请稍后重试';
  }

  return '邮件发送失败，请稍后重试';
}
