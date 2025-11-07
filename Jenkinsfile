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

       // stage('Install Dependencies') {
       //     steps {
           //     sh 'npm install'
         //   }
      //  }

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

        stage('Update Kubernetes Deploy File') {
            steps {
                sh """
                  sed -i "s|${DOCKER_HUB_USER}/${IMAGE_NAME}:v[0-9]*|${DOCKER_HUB_USER}/${IMAGE_NAME}:v${BUILD_NUMBER}|g" ${DEPLOY_FILE}
                  echo " Updated ${DEPLOY_FILE} image to ${DOCKER_HUB_USER}/${IMAGE_NAME}:v${BUILD_NUMBER}"
                """
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                sh """
                  kubectl apply -f ${DEPLOY_FILE}
                  kubectl rollout restart deployment serverm
                  kubectl get pods -o wide
                """
            }
        }
    }
}
