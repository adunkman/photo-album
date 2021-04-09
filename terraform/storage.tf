# tfsec:ignore:AWS002 tfsec:ignore:AWS017
resource "aws_s3_bucket" "storage" {
  bucket = "${var.domain}-storage"
  acl = "private"

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "storage" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}
