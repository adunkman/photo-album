terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.35.0"
    }
  }

  backend "s3" {
    key = "state"
  }
}

provider "aws" {
  region = var.region
}
