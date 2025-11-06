

***
## Automated CI/CD with Jenkins, Docker & Kubernetes
***

## 📖 Project Overview
Serverm is a Node.js microservice designed to demonstrate a full CI/CD workflow using Jenkins, Docker, and Kubernetes.  
Once set up, your pipeline will automatically:
- Pull code from GitHub
- Build and tag a Docker image
- Push the image to Docker Hub
- Update the Kubernetes deployment YAML file
- Deploy the updated version to your Kubernetes cluster

This ensures smooth automation from commit to production deployment.

---

## 🧩 Technology Stack
- Node.js (Express)
- Docker
- Jenkins (Pipeline Automation)
- Kubernetes
- Docker Hub (Container Registry)
- GitHub (Source Control Management)

---

## ⚙️ System Requirements
Before starting, ensure your system includes the following:

| Component | Minimum Requirement |
|------------|---------------------|
| Jenkins | Installed and running |
| Docker | Installed and accessible by Jenkins |
| Kubectl | Configured to access your cluster |
| Node.js | v14 or above |
| GitHub | Repository access |
| Docker Hub | Account and access token ready |

---

## 🗂 Project Folder Structure

serverm-1/
├── src/
│   └── index.js
├── Dockerfile
├── package.json
├── server-deploy.yaml
└── Jenkinsfile

---

## 🔧 Step-by-Step Setup 

### Step 1: Clone the Repository
```
git clone https://github.com/Mayurhatte09/serverm-1.git
cd serverm-1
```

### Step 2: Build and Test Locally (Optional)
```
npm install
npm start
```

### Step 3: Dockerize the Application
Build the Docker image:
```
docker build -t serverm-app:v1 .
docker run -p 8080:8080 serverm-app:v1
```

Access the app locally at `http://localhost:8080`.

---

## ⚙️ Jenkins Configuration

### Step 1: Install and Configure Plugins
Ensure the following Jenkins plugins are active:
- Docker Pipeline
- Pipeline Utility Steps
- Git Plugin
- Kubernetes CLI Plugin

### Step 2: Add Docker Hub Credentials
Go to:

Jenkins Dashboard → Manage Jenkins → Credentials → Global Credentials → Add Credentials

Create:
- ID: `dockerhub-pass`
- Type: Secret Text
- Secret: Docker Hub Password or Access Token

### Step 3: Allow Jenkins Docker Access
```
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Step 4: Check Kubernetes Cluster Connection
Ensure Jenkins has access to your cluster:
```
kubectl get nodes
```

Place your `~/.kube/config` in `/var/lib/jenkins/.kube/config`.

---

## 🧱 Jenkinsfile Explained

| Stage | Purpose |
|--------|----------|
| Git Checkout | Pulls the latest code from GitHub |
| Install Dependencies | Installs npm modules |
| Docker Build | Builds image using Dockerfile |
| Docker Login & Push | Authenticates and pushes image to Docker Hub |
| Update Deploy YAML | Replaces old version tag with new build number |
| Kubernetes Deploy | Applies YAML and triggers rolling restart |

---

## 🚀 Running the Pipeline

1. In Jenkins → **New Item → Pipeline**
2. Enter name: `ServerM-CI-CD`
3. Choose **Pipeline script from SCM**
4. SCM: Git  
   Repository URL:  
   `https://github.com/Mayurhatte09/serverm-1.git`
5. Click **Build Now**

---

## ✅ Verification
After successful build:
```
kubectl get pods
kubectl get svc
kubectl get deployments
```

You should see your `serverm` deployment running with the new image version.

Access via:
```
NodePort or LoadBalancer URL
```

---

## 🧠 Troubleshooting
| Problem | Solution |
|----------|-----------|
| Jenkins cannot access Docker | Add Jenkins to Docker group and restart |
| Image not updating | Check `sed` replacement syntax for version |
| Deployment stuck | Run `kubectl rollout restart deployment serverm` |

---

## 👨‍💻 Maintainer
**Author:** Mayur Hatte  
GitHub: [Mayurhatte09](https://github.com/Mayurhatte09)  
Docker Hub: [mayrhatte09](https://hub.docker.com/u/mayrhatte09)

***
