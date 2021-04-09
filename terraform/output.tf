output "domain" {
  value = var.domain
}

output "name_servers" {
  value = aws_route53_zone.primary.name_servers
}
