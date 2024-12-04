require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();


const { v4: uuidv4 } = require('uuid');
const Users = require('../../models/User');
const Balance = require('../../models/Balance');

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";
const MERCHANT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
const redirectUrl = "https://opinion-be.onrender.com//payment/status";
const successUrl = "http://localhost:3000/payment-successful";
const failureUrl = "http://localhost:3000/payment-failed";

router.post('/create-order', async (req, res) => {
  const { name, email, amount } = req.body;
  const orderId = uuidv4();

  // Payment payload
  const paymentPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: name,
    mobileNumber: 9510268400,
    amount: amount * 100,  // convert to paisa
    merchantTransactionId: orderId,
    redirectUrl: `${redirectUrl}/?id=${orderId}&amount=${amount}&email=${email}`,
    redirectMode: 'POST',
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  };

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
  const keyIndex = 1;
  const string = payload + '/pg/v1/pay' + MERCHANT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  const option = {
    method: 'POST',
    url: MERCHANT_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum
    },
    data: {
      request: payload
    }
  };

  try {
    const response = await axios.request(option);
    res.status(200).json({
      msg: "OK",
      url: response.data.data.instrumentResponse.redirectInfo.url
    });
  } catch (error) {
    console.error("Error in payment", error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

router.post('/status', async (req, res) => {
  const merchantTransactionId = req.query.id;
  const amount = req.query.amount; 
  const email = req.query.email;  

  const keyIndex = 1;
  const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  const option = {
    method: 'GET',
    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': MERCHANT_ID
    },
  };

  try {
    const response = await axios.request(option);

    if (response.data.success === true) {
      
      const user = await Users.findOne({ email: email});

      const balance = await Balance.findOne({ userId: user._id });

      balance.balance += parseInt(amount);

      await balance.save();

      return res.redirect(successUrl);
    } else {
      return res.redirect(failureUrl);
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

module.exports = router;
