const config = require('../config');

async function sendSmsConsole({ to, message }) {
  // Safe default: logs only; no external dependency.
  // In production, configure a real provider.
  console.log(`\n[SMS:console] to=${to}\n${message}\n`);
}

async function sendSmsFast2Sms({ to, message }) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    throw new Error('FAST2SMS_API_KEY missing');
  }

  // Fast2SMS expects an x-www-form-urlencoded body for bulkV2.
  const url = 'https://www.fast2sms.com/dev/bulkV2';

  const raw = String(to).replace(/\D/g, '');
  const number10 = raw.length > 10 ? raw.slice(-10) : raw;
  if (number10.length < 10) {
    throw new Error('Invalid mobile number for Fast2SMS');
  }

  const params = new URLSearchParams();
  params.set('route', process.env.FAST2SMS_ROUTE || 'q');
  params.set('message', message);
  params.set('numbers', number10);

  if (process.env.FAST2SMS_LANGUAGE) params.set('language', process.env.FAST2SMS_LANGUAGE);
  if (process.env.FAST2SMS_SENDER_ID) params.set('sender_id', process.env.FAST2SMS_SENDER_ID);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: apiKey
    },
    body: params.toString()
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`Fast2SMS failed: ${res.status} ${text}`);
  }

  // Some accounts return JSON like: {"return":true/false,"message":"..."}
  try {
    const data = JSON.parse(text);
    if (data && data.return === false) {
      throw new Error(data.message || 'Fast2SMS returned failure');
    }
  } catch {
    // Non-JSON success body; ignore.
  }
}

async function sendSms({ to, message }) {
  switch (config.otp.provider) {
    case 'fast2sms':
      return sendSmsFast2Sms({ to, message });
    case 'console':
    default:
      return sendSmsConsole({ to, message });
  }
}

module.exports = { sendSms };
