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
  image       = "docker-18-04"
  name        = "echosec-bounty-snake"
  region      = "sfo2"
  size        = "s-2vcpu-4gb"
  monitoring  = true
  ssh_keys    = var.ssh_key_ids
  user_data   = <<EOM
    #cloud-config
    runcmd:
      - docker login docker.pkg.github.com -u ${var.github_username} -p ${var.github_token}
      - docker pull docker.pkg.github.com/echosec/bounty-snake-2020/bounty-snake-2020:${var.image_tag}
      - docker run -t -d -p 80:5000 --env VERSION=${var.image_tag} --env REDIS_HOST=${digitalocean_droplet.bounty_snake_redis.ipv4_address} --restart=unless-stopped --log-driver=syslog --log-opt syslog-address=udp://${var.papertrail_url} docker.pkg.github.com/echosec/bounty-snake-2020/bounty-snake-2020:${var.image_tag}
    EOM

  lifecycle {
    create_before_destroy = true
  }

  provisioner "local-exec" {
    command = "./check_health.sh ${self.ipv4_address}"
  }
}

resource "digitalocean_droplet" "bounty_snake_redis" {
  image               = "ubuntu-18-04-x64"
  name                = "echosec-bounty-snake-redis"
  region              = "sfo2"
  size                = "s-1vcpu-1gb"
  monitoring          = true
  ssh_keys            = var.ssh_key_ids
  user_data           = <<EOM
    #cloud-config
    runcmd:
      - sudo apt-get update -y
      - sudo apt-get install -y redis-server
      - sed -i -e '/supervised/s|no|systemd|' /etc/redis/redis.conf
      - sed -i -e '/bind 127.0.0.1 ::1/s|127.0.0.1 ::1|0.0.0.0|' /etc/redis/redis.conf
      - sudo systemctl restart redis.service
    EOM

  lifecycle {
    create_before_destroy = true
  }
}


resource "digitalocean_floating_ip_assignment" "bounty_snake_ip" {
  ip_address = var.floating_ip
  droplet_id = digitalocean_droplet.bounty_snake_droplet.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "digitalocean_firewall" "bounty_snake_firewall" {
  name = "bounty-snake-firewall"

  droplet_ids = [
    digitalocean_droplet.bounty_snake_droplet.id,
    digitalocean_droplet.bounty_snake_redis.id
  ]

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

  inbound_rule {
    protocol         = "tcp"
    port_range       = "6379"
    source_droplet_ids = [
      digitalocean_droplet.bounty_snake_droplet.id
    ]
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
    port_range            = "80"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "443"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }


  outbound_rule {
    protocol              = "tcp"
    port_range            = "6379"
    destination_droplet_ids = [
      digitalocean_droplet.bounty_snake_redis.id
    ]
  }
}
