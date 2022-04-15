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
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return "OK"
    except Exception as e:
        return e.message
