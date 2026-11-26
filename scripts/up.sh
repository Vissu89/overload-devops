#!/usr/bin/env bash
# Rebuild the full environment: AWS infra -> server baseline -> k3s
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Updating admin IP for SSH/API access"
echo "my_ip_cidr = \"$(curl -s https://checkip.amazonaws.com)/32\"" > "$ROOT/terraform/terraform.tfvars"

echo "==> Terraform apply"
cd "$ROOT/terraform"
terraform init -input=false
terraform apply -auto-approve
IP=$(terraform output -raw k3s_public_ip)

echo "==> Updating Ansible inventory with ${IP}"
cd "$ROOT/ansible"
[ -f inventory.ini ] || cp inventory.ini.example inventory.ini
sed -i "s/ansible_host=.*/ansible_host=${IP}/" inventory.ini

echo "==> Waiting for SSH (up to 3 min)"
for i in $(seq 1 36); do
  ansible k3s_server -m ping >/dev/null 2>&1 && break
  [ "$i" -eq 36 ] && { echo "SSH not reachable"; exit 1; }
  sleep 5
done

echo "==> Baseline + k3s"
ansible-playbook playbooks/baseline.yml
ansible-playbook playbooks/k3s.yml

echo "==> Cluster ready"
KUBECONFIG="$HOME/.kube/overload-config" kubectl get nodes
