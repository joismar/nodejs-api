const sgMail = require('@sendgrid/mail')

exports.sendMail = async (to, from, subject, html) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	const msg = {
		to: to,
		from: from,
		subject: subject,
		html: html,
	}

	sgMail.send(msg)
		.catch(() => {
			return false
		})

	return true
}

