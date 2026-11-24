terraform {
  backend "s3" {
    bucket       = "overload-tfstate-844717512770"
    key          = "overload/main.tfstate"
    region       = "ap-south-1"
    profile      = "tf-lab"
    encrypt      = true
    use_lockfile = true
  }
}
