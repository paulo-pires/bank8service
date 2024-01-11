const axios = require('axios');

class BankService {
  constructor() {
    this.client_id = process.env['8BANK_CLIENT_KEY'];
    this.client_secret = process.env['8BANK_CLIENT_SECRET'];
    this.user = process.env['8BANK_USER'];
    this.pass = process.env['8BANK_PASS'];
    this.api_url = process.env['8BANK_API_URL'];
    this.pix = process.env['8BANK_PIX'];

    const auth = Buffer.from(`${this.user}:${this.pass}`).toString('base64');
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    };
  }

  async auth() {
    try {
      const response = await axios.post(`${this.api_url}/api/GetToken`, {
        client_id: this.client_id,
        client_secret: this.client_secret,
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async createOrder(user, value) {
    try {
      const cents = parseFloat(value);
      const token = await this.auth();

      const response = await axios.post(`${this.api_url}/api/GerarQRCodePix`, {
        client_id: this.client_id,
        client_secret: this.client_secret,
        chavePixRecebedor: this.pix,
        identificador: "Depósito PIX",
        valor: cents,
        payer_name: user,
        token: token.Token,
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async payment(pix, value) {
    try {
      const cents = parseFloat(value);
      const token = await this.auth();

      const response = await axios.post(`${this.api_url}/api/EnviarPixChave`, {
        client_id: this.client_id,
        client_secret: this.client_secret,
        valor: cents,
        token: token.Token,
        chavePixPagador: this.pix,
        chavePixRecebedor: pix,
      }, { headers: this.headers });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

module.exports = BankService;