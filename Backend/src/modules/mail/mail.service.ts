const nodemailer = require("nodemailer");

function randomInt(min: number, max?: number): number {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min)) + min;
}

export class MailService {
  /**
   * @param email
   * @param token - Optional token to send. If not provided, generates a random 6-digit token
   * @returns
   */
  static async generateAndSendToken(email: string, token?: string): Promise<string> {
    const generatedToken = token || String(100000 + randomInt(900000));

    const host = process.env.SMTP_HOST || process.env.SMTP_HOSTNAME || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || process.env.SMTP_USERNAME || "";
    const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || "";

    if (!user || !pass) {
      throw new Error(
        "SMTP credentials are missing. Please set SMTP_USER/SMTP_PASS (or SMTP_USERNAME/SMTP_PASSWORD) in Backend .env"
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const subject = "EzTro - Mã xác thực của bạn";
    const html = MailService.buildEmailContent(generatedToken);

    try {
      // Fail fast if SMTP connection/auth is invalid
      await transporter.verify();
      await transporter.sendMail({
        from: `"EzTro" <${user}>`,
        to: email,
        subject,
        html,
      });
    } catch (err) {
      throw err;
    }
    return generatedToken;
  }

  private static buildEmailContent(token: string): string {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; text-align: center; padding: 0; margin: 0; background: #f5f5f5; }
      .wrapper { padding: 32px 16px; }
      .container { padding: 32px 24px; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .brand { font-size: 22px; font-weight: 700; color: #1a73e8; margin: 0 0 4px; }
      .tagline { font-size: 13px; color: #888; margin: 0 0 24px; }
      .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
      .title { font-size: 18px; font-weight: 600; color: #333; margin: 0 0 8px; }
      .desc { font-size: 14px; color: #555; margin: 0 0 20px; }
      .token-box { display: inline-block; background: #f0f6ff; border: 2px dashed #1a73e8; border-radius: 10px; padding: 14px 36px; margin: 0 0 20px; }
      .token { font-size: 32px; font-weight: 700; color: #1a73e8; letter-spacing: 6px; margin: 0; }
      .expiry { font-size: 13px; color: #e53935; margin: 0 0 24px; }
      .note { font-size: 12px; color: #999; line-height: 1.6; margin: 0; }
      .footer { margin-top: 24px; font-size: 12px; color: #aaa; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <p class="brand">EzTro</p>
        <p class="tagline">Quản lý 1 chạm</p>
        <hr class="divider" />
        <p class="title">Xác thực tài khoản của bạn</p>
        <p class="desc">Sử dụng mã dưới đây để xác thực địa chỉ email của bạn:</p>
        <div class="token-box">
          <p class="token">${token}</p>
        </div>
        <p class="expiry">Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
        <hr class="divider" />
        <p class="note">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.<br/>Không chia sẻ mã này với bất kỳ ai.</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} EzTro. Mọi quyền được bảo lưu.</p>
      </div>
    </div>
  </body>
</html>`;
  }
}

export default MailService;
