resource "aws_lambda_function" "authenticator" {
  function_name = "authenticator"
  filename = data.archive_file.authenticator.output_path
  source_code_hash = data.archive_file.authenticator.output_base64sha256
  role = aws_iam_role.authenticator.arn
  handler = "index.handler"
  runtime = "nodejs12.x"
  publish = true
}

data "archive_file" "authenticator" {
  type = "zip"
  output_path = "/terraform/tmp/authenticator.zip"

  source {
    content = jsonencode({
      "username": var.site_username,
      "password": var.site_password,
    })
    filename = "credentials.json"
  }

  source {
    content = data.local_file.authenticator.content
    filename = "index.js"
  }
}

data "local_file" "authenticator" {
  filename = "/authenticator/index.js"
}

resource "aws_iam_role" "authenticator" {
  name = "authenticator"
  assume_role_policy = data.aws_iam_policy_document.authenticator.json
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
