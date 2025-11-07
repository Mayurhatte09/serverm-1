pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'mayrhatte09'
        IMAGE_NAME = 'serverm-app'
        DEPLOY_FILE = 'server-deploy.yaml'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git url: 'https://github.com/Mayurhatte09/serverm-1.git', branch: 'main'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:v${BUILD_NUMBER} .'
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_HUB_PASS')]) {
                    sh """
                      echo "${DOCKER_HUB_PASS}" | docker login -u "${DOCKER_HUB_USER}" --password-stdin
                      docker tag ${IMAGE_NAME}:v${BUILD_NUMBER} ${DOCKER_HUB_USER}/${IMAGE_NAME}:v${BUILD_NUMBER}
                      docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:v${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Kubernetes Deploy File') {
            steps {
                sh """
                  sed -i "s|${DOCKER_HUB_USER}/${IMAGE_NAME}:v[0-9]*|${DOCKER_HUB_USER}/${IMAGE_NAME}:v${BUILD_NUMBER}|g" ${DEPLOY_FILE}
                  echo " Updated ${DEPLOY_FILE} image to ${DOCKER_HUB_USER}/${IMAGE_NAME}:v${BUILD_NUMBER}"
                """
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                // Use the kubeconfig credentials you added in Jenkins
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                      echo "Using kubeconfig at $KUBECONFIG"
                      kubectl config get-contexts
                      kubectl apply -f server-deploy.yaml --validate=false
                      kubectl rollout restart deployment serverm
                      kubectl get pods -o wide
                    '''
                }
            }
        }
    }
}
