# aws-devops-portfolio
AWS-DevOps-Portfolio is a hands-on project implementing AWS cloud infrastructure with DevOps best practices. It covers the entire DevOps lifecycle using industry-standard tools to automate software development, deployment, and monitoring.

Sure! Below is the **README.md** content formatted for easy **copy-paste** into your file. Just copy and paste it into your `README.md` file and upload it to your GitHub repository. 🚀

---

```md
# 🚀 AWS Terraform Automated Website Deployment

## 📌 Overview
This project automates the deployment of a **static website** using **Terraform, AWS EC2, Nginx, and GitHub**. It provisions an EC2 instance, installs Nginx, fetches website files from GitHub, and automatically updates the site whenever changes are pushed.

---

## 🌟 Features
- **Infrastructure as Code (IaC)** using Terraform
- **Automated deployment** of an AWS EC2 instance
- **Nginx web server setup** to serve static files
- **GitHub integration** to fetch website files automatically
- **Cron job for continuous deployment** (auto-updates on every GitHub push)

---

## 🔧 Prerequisites
Ensure you have the following installed:
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [AWS CLI](https://aws.amazon.com/cli/)
- A GitHub repository with your **HTML, CSS, and JavaScript** files

---

## 🏗️ Infrastructure Setup with Terraform
### **1️⃣ Install Terraform**
Run the following commands:
```bash
sudo apt update
sudo apt install -y terraform
terraform -v  # Verify installation
```

### **2️⃣ Create an AWS IAM User for Terraform**
1. Go to **AWS IAM Console** → **Users** → **Create User**
2. Assign **AdministratorAccess** policy
3. Copy the **Access Key** and **Secret Key** for Terraform

### **3️⃣ Configure AWS CLI**
```bash
aws configure
```
Enter your:
- AWS **Access Key**
- AWS **Secret Key**
- Default region (e.g., `us-east-1`)

---

## 📝 Terraform Configuration (`main.tf`)
Create a **Terraform configuration file** (`main.tf`) with the following:

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "web_sg" {
  name        = "web-server-sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web_server" {
  ami           = "ami-0241b1d769b029352"
  instance_type = "t2.micro"
  key_name      = "terraform-key"
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y nginx git
              sudo systemctl start nginx
              sudo systemctl enable nginx

              sudo rm -rf /usr/share/nginx/html/*
              sudo git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git /usr/share/nginx/html
              sudo chmod -R 755 /usr/share/nginx/html
              sudo systemctl restart nginx
              EOF

  tags = {
    Name = "DevOps-EC2-instance"
  }
}

output "ec2_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.web_server.public_ip
}
```

---

## 🚀 Deploying with Terraform
Run the following Terraform commands:

```bash
terraform init
terraform apply -auto-approve
```
Once completed, Terraform will output the **EC2 Public IP**. Access your website at:
```
http://<EC2-PUBLIC-IP>
```

---

## 🔄 Automating GitHub Updates with Cron Job
### **1️⃣ SSH into the EC2 Instance**
```bash
ssh -i "terraform-key.pem" ec2-user@<EC2-PUBLIC-IP>
```

### **2️⃣ Set Up a Cron Job**
Run:
```bash
crontab -e
```
Add the following line:
```
*/5 * * * * cd /usr/share/nginx/html && git reset --hard origin/main && git pull origin main && sudo systemctl restart nginx
```
✅ This ensures **your website auto-updates every 5 minutes** when you push changes to GitHub.

---

## 🎯 Verification
After deploying, verify that:
- **Your website is accessible at:** `http://<EC2-PUBLIC-IP>`
- **Cron jobs are running:** `sudo grep CRON /var/log/cron`
- **Nginx is active:** `sudo systemctl status nginx`

---

## 🛑 Destroying the Infrastructure
To **delete all AWS resources** created by Terraform:
```bash
terraform destroy -auto-approve
```

---

## 🎉 Conclusion
This setup ensures your website **automatically deploys on AWS** with **Terraform & Nginx**, while staying up-to-date with **GitHub auto-sync** using cron jobs.
