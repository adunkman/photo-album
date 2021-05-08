locals {
  function_name = "authenticator"
}

resource "aws_lambda_function" "authenticator" {
  function_name = local.function_name
  filename = data.archive_file.authenticator.output_path
  source_code_hash = data.archive_file.authenticator.output_base64sha256
  role = aws_iam_role.authenticator.arn
  handler = "lambda.handler"
  runtime = "nodejs12.x"
  publish = true

  depends_on = [
    aws_cloudwatch_log_group.authenticator
  ]
}

resource "aws_cloudwatch_log_group" "authenticator" {
  name = "/aws/lambda/${var.region}.${local.function_name}"
  retention_in_days = 14
}

data "archive_file" "authenticator" {
  type = "zip"
  output_path = "/terraform/tmp/authenticator.zip"

  source {
    content = data.template_file.dotenv.rendered
    filename = ".env"
  }

  source {
    content = data.local_file.authenticator.content
    filename = "lambda.js"
  }
}

data "template_file" "dotenv" {
  template = file("/terraform/authenticator.dotenv.tpl")
  vars = {
    DOMAIN = var.domain
    COOKIE_ENCRYPTION_SECRET = var.cookie_encryption_secret
    JWT_ENCRYPTION_SECRET = var.jwt_encryption_secret
    SUPPORT_EMAIL = var.support_email
  }
}

data "local_file" "authenticator" {
  filename = "/auth/dist/lambda.js"
}

resource "aws_iam_role" "authenticator" {
  name = "authenticator"
  assume_role_policy = data.aws_iam_policy_document.authenticator.json
}

resource "aws_iam_policy_attachment" "authenticator_policy" {
  name = "authenticator_policy"
  roles = [ aws_iam_role.authenticator.name ]
  policy_arn = aws_iam_policy.authenticator_policy.arn
}

resource "aws_iam_policy" "authenticator_policy" {
  name = "authenticator_policy"
  policy = data.aws_iam_policy_document.authenticator_policy.json
}

data "aws_iam_policy_document" "authenticator" {
  statement {
    actions = [ "sts:AssumeRole" ]

    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com",
      ]
    }
  }
}

data "aws_iam_policy_document" "authenticator_policy" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "${aws_cloudwatch_log_group.authenticator.arn}:*"
    ]
  }

  statement {
    actions = [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ]

    resources = [ "*" ]
  }
}
