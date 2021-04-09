resource "aws_acm_certificate" "primary" {
  domain_name = var.domain
  validation_method = "DNS"
  subject_alternative_names = [ "*.${var.domain}" ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "primary" {
  certificate_arn = aws_acm_certificate.primary.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
