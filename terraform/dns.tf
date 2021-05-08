resource "aws_route53_zone" "primary" {
  name = var.domain
}

resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.primary.zone_id
  name = aws_route53_zone.primary.name
  type = "A"

  alias {
    name = aws_cloudfront_distribution.primary.domain_name
    zone_id = aws_cloudfront_distribution.primary.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name = "www.${aws_route53_zone.primary.name}"
  type = "A"

  alias {
    name = aws_cloudfront_distribution.primary.domain_name
    zone_id = aws_cloudfront_distribution.primary.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.primary.domain_validation_options : dvo.domain_name => {
      name = dvo.resource_record_name
      record = dvo.resource_record_value
      type = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name = each.value.name
  records = [each.value.record]
  ttl = 60
  type = each.value.type
  zone_id = aws_route53_zone.primary.zone_id
}

resource "aws_route53_record" "root_txt" {
  zone_id = aws_route53_zone.primary.zone_id
  name = aws_route53_zone.primary.name
  type = "TXT"
  ttl = 600
  records = [
    "v=spf1 include:amazonses.com ~all",
    "v=DMARC1; p=reject; rua=mailto:${var.support_email}; pct=100; adkim=s; aspf=s",
  ]
}

resource "aws_route53_record" "ses_domain_verification_record" {
  zone_id = aws_route53_zone.primary.zone_id
  name = "_amazonses.${var.domain}"
  type = "TXT"
  ttl = 600
  records = [aws_ses_domain_identity.domain.verification_token]
}

resource "aws_route53_record" "ses_domain_dkim_record" {
  count = 3
  zone_id = aws_route53_zone.primary.zone_id
  name = "${element(aws_ses_domain_dkim.domain.dkim_tokens, count.index)}._domainkey"
  type = "CNAME"
  ttl = "600"
  records = ["${element(aws_ses_domain_dkim.domain.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

resource "aws_route53_record" "ses_domain_mail_from_mx" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = aws_ses_domain_mail_from.domain.mail_from_domain
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.us-east-1.amazonses.com"]
}
