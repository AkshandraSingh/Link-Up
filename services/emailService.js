const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
    }
});

const mailOptions = async (userEmail, link, hashData = 0) => {
    if (!hashData && link) {
        await transporter.sendMail({
            from: `"Link Up" <${process.env.SENDER_EMAIL}>`,
            to: userEmail,
            subject: "Reset Password",
            html: `
                <!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * {
                            margin: 0px;
                            padding: 0px;
                        }

                        #heading {
                            margin: 12px;
                            font-family: Georgia, 'Times New Roman', Times, serif;
                            font-size: 23px;
                            text-align: center;
                        }

                        p {
                            margin: 14px;
                            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                            font-size: 16px;
                            text-align: center;
                        }

                        #link {
                            text-decoration: none;
                            font-weight: bold;
                            color: #3766e9;
                        }

                        #link:hover {
                            color: crimson;
                            cursor: pointer;
                        }
                    </style>
                </head>

                <body>
                    <h1 id="heading">Welcome to Link Up</h1>
                    <p>Here is your link for Reset Password</p>
                    <p><a href="${link}" id="link">resetPassword</a></p>
                </body>

                </html>`});
    } else {
        await transporter.sendMail({
            from: `"Link Up" <${process.env.SENDER_EMAIL}>`,
            to: userEmail,
            subject: "Follow Request",
            html: `<!DOCTYPE html>
                    <html lang="en">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Follow Request</title>
                        <style>
                            @import url("https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap");
                            @import url("https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap");

                            * {
                                margin: 0px;
                                padding: 0px;
                            }

                            body {
                                display: flex;
                                justify-content: center;
                                height: 100vh;
                                margin: 0;
                            }

                            .content-container {
                                text-align: center;
                            }

                            img {
                                width: 277px;
                                height: 35vh;
                            }

                            p {
                                font-family: "Roboto Slab", serif;
                            }

                            button {
                                background-color: rgb(151, 50, 247);
                                border-radius: 22px;
                                width: 200px;
                                height: 38px;
                                font-family: "Josefin Sans", sans-serif;
                            }

                            button:hover {
                                cursor: pointer;
                                background-color: rgb(141, 98, 197);
                            }
                        </style>
                    </head>

                    <body>
                        <div class="content-container">
                            <img src="https://cdn.dribbble.com/users/2563862/screenshots/6141448/untitled-7_4x.png" alt="LinkUp Logo">
                            <p>Hello User check your link up account someone follows you</p>
                            <button>Open Linkup</button>
                        </div>
                    </body>

                    </html>`})
    }
}

module.exports = {
    mailOptions,
}
