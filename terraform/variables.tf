variable "domain" {
  type = string
}

variable "region" {
  type = string
}

variable "site_username" {
  type = string
  sensitive = true
}

variable "site_password" {
  type = string
  sensitive = true
}
