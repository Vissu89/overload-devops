variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "tf-lab"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "my_ip_cidr" {
  description = "Your public IP in CIDR form (x.x.x.x/32) for SSH and k8s API access"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for the k3s node"
  type        = string
  default     = "t3.small"
}

variable "public_key_path" {
  description = "Path to the SSH public key"
  type        = string
  default     = "~/.ssh/overload-key.pub"
}
