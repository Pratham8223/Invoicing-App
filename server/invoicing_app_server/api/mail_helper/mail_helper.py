import os
import base64

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (Mail, Attachment, FileContent, FileName, FileType, Disposition)


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


def send_email_with_invoice(to_email, subject, content, invoice_id):
    message = Mail(
        from_email='admin@hiresuyash.com',
        to_emails=to_email,
        subject=subject,
        html_content='<strong>{}</strong>'.format(content))

    with open('./invoices/{}.pdf'.format(invoice_id), 'rb') as f:
        data = f.read()
        f.close()
    encoded_file = base64.b64encode(data).decode()

    attachedFile = Attachment(
        FileContent(encoded_file),
        FileName('attachment.pdf'),
        FileType('application/pdf'),
        Disposition('attachment')
    )
    message.attachment = attachedFile
    try:
        sg = SendGridAPIClient(os.environ['SG_API_KEY'])
        res = sg.send(message)
        return res.status_code
    except Exception as e:
        return e.message