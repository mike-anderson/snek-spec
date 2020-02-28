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

resource "digitalocean_droplet" "bounty_snake_droplet" {
  image     = "docker-18-04"
  name      = "echosec-bounty-snake"
  region    = "sfo2"
  size      = "s-2vcpu-4gb"
  ssh_keys  = [
    25059594 # brandonb@echosec.net
  ]
  user_data = <<EOM
    #cloud-config
    runcmd:
      - docker login docker.pkg.github.com -u ${var.github_username} -p ${var.github_token}
      - docker pull docker.pkg.github.com/echosec/bounty-snake-2020/bounty-snake-2020:latest
      - docker run -t -d -p 80:5000 docker.pkg.github.com/echosec/bounty-snake-2020/bounty-snake-2020:latest
    EOM
}

resource "digitalocean_domain" "bounty_snake_domain" {
  name       = var.domain_name
  ip_address = digitalocean_droplet.bounty_snake_droplet.ipv4_address
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

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "53"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "53"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "443"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
