variable "api_token" {
  description = "DigitalOcean API personal access token"
  type        = string
}

variable "droplet_ssh_key" {
  description = "Public SSH key needed to SSH into DigitalOcean droplet"
  type        = string
}
