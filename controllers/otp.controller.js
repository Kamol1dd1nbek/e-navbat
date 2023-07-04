const { AddMinutesToDate, dates } = require("../helpers");

const DeviceDetector = require("node-device-detector");
const { v4 : uuidv4 } = require("uuid");
const { encode, decode } = require("../services/crypt");
const pool = require("../config/db");
const otpGenerator = require("otp-generator");
const { response } = require("express");
const myJwt = require("../services/jwtService");
const bcrypt = require('bcrypt');

const newOTP = async (req, res) => {
    const { phone_number } = req.body;

    // Generate OTP
    const otp = otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 3);

    const query = "INSERT INTO otp (id, otp, expiration_time) values ($1, $2, $3) returning id;";
    const values = [uuidv4(), otp, expiration_time];

    const newOtp = await pool.query(query, values);

    const details = {
        timestamp: now,
        check: phone_number,
        success: true,
        message: "OTP is recived",
        otp_id: newOtp.rows[0].id,
    };

    const encoded = await encode(JSON.stringify(details));
    return res.send({Status: "Success", Details: encoded});
};


const verifyOTP = async (req, res) => {
    const { verification_key, otp, check } = req.body;
    var currentdate = new Date();
    let decoded;

    try {
        decoded = await decode(verification_key);
    } catch (error) {
        const response = { Status: "Failure", Details: "Bad Request" };
        return res.status(400).send(response);
    }

    var obj = JSON.parse(decoded);

    const check_obj = obj.check;
    // console.log(obj);

    if (check_obj != check) {
        const response = {
            Status: "Failure",
            Deatails: "OTP was not sent to this particular phone number"
        };
        return res.status(400).send(response);
    }

    const otpResult = await pool.query("SELECT * FROM otp WHERE id = $1", [obj.otp_id]);

    const result = otpResult.rows[0];

    if (result != null) {
        // Check if otp is alreay used or not
        if (result.verified != true) {
            //check if otp is expired or not
            if (dates.compare(result.expiration_time, currentdate) == 1) {
                //check if otp is equal to the otp in the DB
                if (otp == result.otp) {
                    
                    await pool.query("UPDATE otp SET verified = $2 WHERE id = $1", [result.id, true]);

                    query = "SELECT * FROM client WHERE client_phone_number = $1";
                    values = [check];

                    const clientResult = await pool.query(query, values);
                    let clientId, details;

                    if (clientResult.rows.length == 0) {

                        const newClient = await pool.query("INSERT INTO CLIENT (client_phone_number, otp_id) VALUES ($1, $2) RETURNING id", [check, obj.otp_id]);
                        clientId = newClient.rows[0].id;
                        details = "new";

                    } else {
                        clientId = clientResult.rows[0].id;
                        details = "old";

                        const query = "UPDATE client SET otp_id = $2 WHERE id = $1;";
                        const values = [clientId, obj.otp_id];
                        await pool.query(query, values);
                    }

                    const payload = {
                        id: clientId,
                    }
                    const tokens = myJwt.generateTokens(payload);

                    // save refresh_token to datebase
                    const detector = new DeviceDetector({
                        clientIndexes: true,
                        deviceIndexes: true,
                        deviceAliasCode: false,
                      });
                    
                    const userAgent = req.headers["user-agent"];
                    const result = detector.detect(userAgent);
                    console.log('result parse', result);

                    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 10);

                    const tP = {
                        tableName: "client",
                        device: JSON.stringify(result.device),
                        os: JSON.stringify(result.os),
                        client: JSON.stringify(result.client),
                        clientId,
                        hashed_refresh_token
                    }

                    query = "INSERT INTO token (tableName, user_id, user_os, user_browser, user_device, hashed_refresh_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
                    values = [tP.tableName, tP.clientId, tP.os, tP.client, tP.device, tP.hashed_refresh_token];
                    const token = await pool.query(query, values);

                    const response = {
                        Status: "Success",
                        Deatails: details,
                        Check: check,
                        ClientId: clientId,
                        tokens
                    };
                    res.status(200).send(response);
                } else {
                    const result = {Status: "Failure", Deatails: "OTP Not Matched"};
                    return res.status(400).send(result);
                }
            } else {
                const result = {Status: "Failure", Deatails: "OTP Expired"};
                return res.status(400).send(result);
            }
        } else {
            const result = {Status: "Failure", Deatails: "OTP Already Used"};
            return res.status(400).send(result);
        }
    } else {
        const result = {Status: "Failure", Deatails: "Bad Request"};
        return res.status(400).send(result);
    }
}

const deleteOTP = async (req, res) => {
    const { verification_key, check } = req.body;

    let decoded;

    try {
        decoded = await decode(verification_key);
    } catch (error) {
        const response = { Status: "Failure", Details: "Bad request"};
        return res.status(400).send(response);
    }
    var obj = JSON.parse(decoded);
    const check_obj = obj.check;

    if ( check_obj != check ) {
        const response = { Status: "Failure", Details: "OTP was not sent to this particular phone number" };
        return res.status(400).send(response);
    }
    let params = {
        id: obj.otp_id,
    };

    const query = "DELETE FROM otp WHERE  id = $1 RETURNING id";

    const deletedOTP = await pool.query(query, [params.id]);

    if (deletedOTP.rows.length == 0 ) {
        return res.status(400).send("Invalid Id");
    }
    return res.status(200).send(params);
};

module.exports = {
    newOTP,
    verifyOTP,
    deleteOTP
}