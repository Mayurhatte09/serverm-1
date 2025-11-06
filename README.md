# update
sudo yum update -y

# install Docker
sudo amazon-linux-extras install docker -y

# start Docker and enable on boot
sudo systemctl start docker
sudo systemctl enable docker

# add ec2-user to docker group so you can use docker without sudo
sudo usermod -aG docker ec2-user

# install git
sudo yum install git -y

# (Log out and back in for group change to take effect)
exit
# then re-ssh (same ssh command as before)
  
