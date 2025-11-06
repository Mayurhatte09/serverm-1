Install docker and git Amazon linux ec2

 
- update
```
sudo yum update -y
```

- install Docker
```
sudo amazon-linux-extras install docker -y
```
- start Docker and enable on boot
```
sudo systemctl start docker
sudo systemctl enable docker
```
- add ec2-user to docker group so you can use docker without sudo
```
sudo usermod -aG docker ec2-user
```
 - install git
```
sudo yum install git -y
```
- (Log out and back in for group change to take effect)
exit
- then re-ssh (same ssh command as before)


install docker and git for ubuntu 
```
sudo apt update -y
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
```
# install Docker official repo
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

# start and enable
```
sudo systemctl start docker
sudo systemctl enable docker
```

# add ubuntu user to docker group
```
sudo usermod -aG docker ubuntu
```
# install git
```
sudo apt install -y git
```
# logout and re-ssh for group membership to apply
exit
# re-ssh


