***

# Full CI/CD Pipeline With Jenkins, Docker, and Kubernetes

Automate build, test, deploy, and monitoring of two Node.js apps—`serverm-1` and `FinalCRUDwithMongoose-Sequelize-1`—from source to Kubernetes cluster using Jenkins, Docker, and Docker Hub, with easy extension to auto-deploy via GitHub webhook triggers.

## Features

- One-click Jenkins pipeline for two apps
- Automated Docker build and push to Docker Hub
- Updates and deploys Kubernetes YAMLs seamlessly
- Verifies running pods as build output
- Easily extend to trigger builds via GitHub webhook

***

## Prerequisites

- Jenkins running with Docker and kubectl installed
- Docker Hub account for pushing images
- Kubernetes cluster accessible from Jenkins (local or on cloud/EC2)
- GitHub repos for both Node.js projects
- Pipeline repo (recommended) for Jenkinsfile storage

***

## Step 1: Jenkins Environment Prep

1. **Install Jenkins on Linux VM/EC2.**
2. **Install Docker:**  
   `sudo apt-get install docker.io`
3. **Add Jenkins User to Docker Group:**  
   ```
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```
4. **Configure kubectl for Jenkins:**  
   ```
   mkdir -p /var/lib/jenkins/.kube
   sudo cp ~/.kube/config /var/lib/jenkins/.kube/config
   sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config
   ```
5. **Add Docker Hub Credentials to Jenkins:**  
   - Go to Jenkins > Manage Credentials > (your domain) > Add Credentials  
   - Type: Secret text  
   - ID: `dockerhub-pass`  
   - Secret: Docker Hub password or token  

***

## Step 2: Prepare Repositories

- Clone or fork:
  - [`serverm-1`](https://github.com/Mayurhatte09/serverm-1)
  - [`FinalCRUDwithMongoose-Sequelize-1`](https://github.com/Mayurhatte09/FInalCRUDwithMongoose-Sequelize-1)
- Create new repo (recommended):  
  - `cicd-pipeline` (for Jenkinsfile and documentation/ops assets)

***

## Step 3: Configure Jenkins Pipeline Job

- In Jenkins Dashboard:
  - **New Item** > *Pipeline*
    - Name: `full-ci-cd-pipeline`
  - Scroll to "Pipeline" section:
    - Definition: Pipeline script from SCM
    - SCM: Git
    - Repository URL: *(your repo holding Jenkinsfile)*
  - Save & click "Build Now" to test pipeline

***

## Step 4: Jenkinsfile (Automated CI/CD Script)

- Save this `Jenkinsfile` to your pipeline repo:

```groovy
pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'mayrhatte09'
        SERVER_REPO = 'https://github.com/Mayurhatte09/serverm-1.git'
        FINALCRUD_REPO = 'https://github.com/Mayurhatte09/FInalCRUDwithMongoose-Sequelize-1.git'
    }

    stages {
        stage('Checkout Serverm') {
            steps { dir('serverm') { git url: "${SERVER_REPO}", branch: 'main' } }
        }
        stage('Build & Push Serverm Image') {
            steps { /* Docker build, push, YAML update, apply & restart */ }
        }
        stage('Checkout FinalCRUD') {
            steps { dir('finalcrud') { git url: "${FINALCRUD_REPO}", branch: 'main' } }
        }
        stage('Build & Push FinalCRUD Image') {
            steps { /* Docker build, push, YAML update, apply & restart */ }
        }
        stage('Verify Kubernetes Pods') {
            steps { sh "kubectl get pods -o wide" }
        }
    }
}
```

*(See the full Jenkinsfile code above for each step detail.)*

***

## Step 5: How the Automation Works

- Jenkins clones **both repos**.
- Installs app dependencies.
- Builds Docker images, tags by build number.
- Pushes to Docker Hub, auto-updating image tags.
- `sed` command updates deployment YAMLs with the latest image tag.
- Applies YAML files to Kubernetes, rolling out new deployments.
- Verifies running pods on cluster for final status.

***

## Step 6: Enable Auto-Build on GitHub Push (Webhook)

1. **In GitHub Repo:**
   - Settings > Webhooks > Add webhook
   - Payload URL:  
     `http://<JENKINS_SERVER>:8080/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`
2. **In Jenkins Job:**
   - Configure > "Build Triggers" > Check "GitHub hook trigger for GITScm polling"
3. **Commit and Push code** to either app's repo & Jenkinsfile repo to test
   - Build will auto-trigger, redeploy both apps

***

## Troubleshooting

- **Docker errors?**
  - Ensure Jenkins runs in Docker group, and credentials are correct.
- **Kubernetes access issues?**
  - Confirm `~/.kube/config` for Jenkins user is configured.
- **Build not autotriggering?**
  - Double check GitHub webhook config and Jenkins trigger setting.

***

## Tech Stack

| Component        | Purpose                                          |
|:-----------------|:-------------------------------------------------|
| Jenkins          | CI/CD workflow orchestration                     |
| Docker           | Build, tag, and push container images            |
| Docker Hub       | Store images/repositories                        |
| Kubernetes       | Container orchestration/deployment               |
| GitHub           | Source storage, webhook triggers                 |

***

## Best Practices

- Parameterize Docker tags for traceable releases
- Store sensitive credentials securely (Jenkins secrets)
- Keep deployment YAMLs updated, use rolling restarts
- Validate pod health with kubectl after each deployment

***

## Credits

Built by [Mayurhatte09](https://github.com/Mayurhatte09).  
