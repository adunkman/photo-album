variable "domain" {
  type = string
}

variable "region" {
  type = string
}

variable "support_email" {
  type = string
  sensitive = true
}

variable "cookie_encryption_secret" {
  type = string
  sensitive = true
}

variable "jwt_encryption_secret" {
  type = string
  sensitive = true
}
