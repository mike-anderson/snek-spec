terraform {
  required_version = "~> 0.12.0"

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "echosec"

    workspaces {
      name = "battlesnake-2020"
    }
  }
}

provider "digitalocean" {
  token = var.api_token
}

resource "digitalocean_ssh_key" "bounty_snake_ssh_key" {
  name       = "bounty-snake-ssh-key"
  public_key = var.droplet_ssh_key
}

resource "digitalocean_droplet" "bounty_snake_droplet" {
  image    = "ubuntu-18-04-x64"
  name     = "echosec-bounty-snake"
  region   = "nyc3"
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.bounty_snake_ssh_key.fingerprint]
}

resource "digitalocean_firewall" "bounty_snake_firewall" {
  name = "bounty-snake-firewall"

  droplet_ids = [digitalocean_droplet.bounty_snake_droplet.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "22"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "80"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "443"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
