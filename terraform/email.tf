resource "aws_ses_email_identity" "support_email" {
  email = var.support_email
}

resource "aws_ses_domain_identity" "domain" {
  domain = var.domain
}

resource "aws_ses_domain_dkim" "domain" {
  domain = aws_ses_domain_identity.domain.domain
}

resource "aws_ses_domain_mail_from" "domain" {
  domain = aws_ses_domain_identity.domain.domain
  mail_from_domain = "mail.${aws_ses_domain_identity.domain.domain}"
}
