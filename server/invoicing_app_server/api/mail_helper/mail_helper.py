import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_email(to_email, subject, content):
    message = Mail(
        from_email='admin@hiresuyash.com',
        to_emails=to_email,
        subject=subject,
        html_content='<strong>{}</strong>'.format(content))
    try:
        sg = SendGridAPIClient(os.environ['SG_API_KEY'])
        sg.send(message)
        return "OK"
    except Exception as e:
        return e.message
