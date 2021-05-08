locals {
  s3_origin_id = "site"
}

# tfsec:ignore:AWS071
resource "aws_cloudfront_distribution" "primary" {
  enabled = true
  is_ipv6_enabled = true
  web_acl_id = aws_wafv2_web_acl.primary.arn

  aliases = [ var.domain ]
  default_root_object = "index.html"

  custom_error_response {
    error_caching_min_ttl = 3600
    error_code = 404
    response_code = 404
    response_page_path = "/404.html"
  }

  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.site.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress = true

    lambda_function_association {
      event_type = "viewer-request"
      lambda_arn = aws_lambda_function.authenticator.qualified_arn
      include_body = true
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.primary.arn
    minimum_protocol_version = "TLSv1.2_2019"
    ssl_support_method = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "site" {
  comment = "site"
}
