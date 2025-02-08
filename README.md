# 🚀 AWS-Terraform Automated Website Deployment

## 📌 Overview
This project focuses on automated deployment of a  website using Terraform, AWS EC2, Nginx, and GitHub. The goal is to provision cloud infrastructure efficiently using Infrastructure as Code (IaC) and ensure continuous deployment through GitHub integration. This setup enables seamless website updates whenever changes are pushed to the GitHub repository.

Objective
The primary objective of this project is to automate and streamline the process of deploying and maintaining a web server on AWS, making it efficient, scalable, and easy to manage. By utilizing Terraform, we eliminate manual configurations and ensure that infrastructure is replicable, version-controlled, and easily modifiable.

Key Components
Terraform: Used to define and provision AWS resources such as EC2 instances and security groups.
AWS EC2: Virtual server hosting the website.
Nginx: Web server used to serve static content.
GitHub: Centralized repository for website source code.
Cron Jobs: Automates periodic updates by pulling the latest changes from GitHub.

Project Breakdown

1️⃣ Infrastructure as Code with Terraform
The project leverages Terraform to provision an AWS EC2 instance and configure the necessary security groups. Using Terraform’s declarative syntax, we define infrastructure in code, making it easy to deploy, modify, and destroy AWS resources efficiently.

2️⃣ Web Server Setup with Nginx
Upon launching the EC2 instance, a user data script automatically installs and starts Nginx, setting it up to serve a static website. Nginx is configured to host files from the /usr/share/nginx/html directory.

3️⃣ Automated Deployment from GitHub
To ensure continuous deployment, the EC2 instance clones the website files from a GitHub repository upon initialization. Additionally, a cron job is set up to periodically check for updates, ensuring that any changes pushed to the GitHub repository are automatically pulled and reflected on the live website.

4️⃣ Security & Access Control
The AWS security group configuration allows:

SSH (port 22): Restricted access to secure remote connections.
HTTP (port 80): Open access for serving website traffic.
5️⃣ Continuous Integration & Deployment (CI/CD)
By using cron jobs, the EC2 instance periodically runs:

bash
Copy
Edit
cd /usr/share/nginx/html && git reset --hard origin/main && git pull origin main && sudo systemctl restart nginx
This ensures that the website is always up-to-date with the latest changes from GitHub without manual intervention.

Use Cases & Benefits
Automated Website Deployment: No manual intervention needed after setup.
Scalability: Easily replicate infrastructure across multiple instances or environments.
Version Control & Backup: All changes are tracked via GitHub, ensuring rollback capabilities.
Infrastructure Consistency: Eliminates configuration drift with IaC principles.
Cost Efficiency: Uses AWS Free Tier resources with minimal operational cost.
Conclusion
This project demonstrates modern DevOps best practices by automating website deployment using Terraform, AWS, and GitHub. By integrating Infrastructure as Code, automation, and version control, it ensures reliability, efficiency, and maintainability.

This approach is ideal for startups, developers, and businesses looking for a cost-effective and scalable web hosting solution while embracing cloud automation. 🚀
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
- [Git](https://git-scm.com/downloads)
- A GitHub repository with your **HTML, CSS, and JavaScript** files

---
## Instillation
## 🏠 Step 1: Creating an EC2 Instance
### **1️⃣ Launch an EC2 Instance**
1. Log in to **AWS Management Console**
2. Navigate to **EC2 Dashboard** → **Launch Instance**
3. Choose **Amazon Linux 2 AMI**
4. Select **t2.micro** instance type (free tier eligible)
5. Configure security group to allow **SSH (22), HTTP (80)**
6. Create or select a **key pair** (download the `.pem` file)
7. Click **Launch Instance**

---

## 🏢 Step 2: Installing Terraform on EC2
### **1️⃣ Connect to EC2 Instance**
```bash
ssh -i "your-key.pem" ec2-user@<EC2-PUBLIC-IP>
```

### **2️⃣ Install Terraform**
```bash
sudo yum update -y
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum install -y terraform
terraform -v  # Verify installation
```

---

## 🏰 Step 3: Installing Nginx, Git, and Setting Up Cron Jobs
### **1️⃣ Install Nginx & Git**
```bash
sudo yum install -y nginx git
sudo systemctl start nginx
sudo systemctl enable nginx
```

### **2️⃣ Set Up a Cron Job for Auto-Updates**
```bash
crontab -e
```
Add the following line:
```
*/5 * * * * cd /usr/share/nginx/html && git reset --hard origin/main && git pull origin main && sudo systemctl restart nginx
```
This ensures **your website auto-updates every 5 minutes** when you push changes to GitHub.

---

## 📁 Step 4: Creating & Pushing HTML, CSS, and JS Files to GitHub
### **1️⃣ Initialize a GitHub Repository Locally**
```bash
git init
```

### **2️⃣ Create HTML, CSS, and JS Files**
```bash
mkdir website && cd website
nano index.html  # Add HTML content
nano styles.css  # Add CSS styles
nano script.js   # Add JavaScript functionality
```

### **3️⃣ Push Files to GitHub**
```bash
git add .
git commit -m "Initial commit for website"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 📝 Step 5: Terraform Configuration (`main.tf`)
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

## 🚀 Step 6: Deploying with Terraform
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

## 🎯 Verification
After deploying, verify that:
- **Your website is accessible at:** `http://<EC2-PUBLIC-IP>`
- **Cron jobs are running:** `sudo grep CRON /var/log/cron`
- **Nginx is active:** `sudo systemctl status nginx`

---

## 🚽 Destroying the Infrastructure
To **delete all AWS resources** created by Terraform:
```bash
terraform destroy -auto-approve
```
![Screenshot 2025-02-07 222944](https://github.com/user-attachments/assets/9270f751-c981-4184-8d0c-d2c7ae698fbb)
![Screenshot 2025-02-07 223042](https://github.com/user-attachments/assets/86e7c95f-1d2e-4159-8062-3471363d82c2)
![Screenshot 2025-02-07 223108](https://github.com/user-attachments/assets/99e04a82-6ee1-4efd-bc9f-9544f43003ca)
![Screenshot 2025-02-07 223143](https://github.com/user-attachments/assets/8fa2bc47-dcbd-43ea-856c-ae5de06974c8)
![Screenshot 2025-02-07 223313](https://github.com/user-attachments/assets/0cec2dba-b078-47de-a8a3-1c204ec284ac)
---

## 🎉 Conclusion
This setup ensures your website **automatically deploys on AWS** with **Terraform & Nginx**, while staying up-to-date with **GitHub auto-sync** using cron jobs.

### **🚀 Happy DevOps!**

