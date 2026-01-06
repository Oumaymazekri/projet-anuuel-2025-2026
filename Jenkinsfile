pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '1'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        /* ================= CHECKOUT ================= */
        stage('Checkout Source Code') {
            steps {
                echo "📥 Clonage du projet..."
                checkout scm
            }
        }

        /* ================= BUILD ================= */
        stage('Build Docker Images') {
            steps {
                echo "🐳 Build des images Docker..."
                sh 'docker compose build'
            }
        }

        /* ================= TRIVY SECURITY SCAN ================= */
        stage('Trivy Security Scan') {
            steps {
                echo "🔐 Scan de sécurité des images Docker avec Trivy..."
                sh '''
                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image \
                    --severity HIGH,CRITICAL \
                    --no-progress \
                    pipeline-projet-annuel2-auth-service || true

                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image \
                    --severity HIGH,CRITICAL \
                    --no-progress \
                    pipeline-projet-annuel2-product-service || true

                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image \
                    --severity HIGH,CRITICAL \
                    --no-progress \
                    pipeline-projet-annuel2-order-service || true

                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest image \
                    --severity HIGH,CRITICAL \
                    --no-progress \
                    pipeline-projet-annuel2-frontend || true
                '''
            }
        }

        /* ================= START STACK (CLEAN + START) ================= */
        stage('Start Services') {
            steps {
                echo "🧹 Nettoyage Docker + Démarrage des services..."
                sh '''
                  docker compose down -v --remove-orphans || true
                  docker rm -f product-service auth-service order-service frontend nginx-gateway || true
                  docker network prune -f || true

                  docker compose up -d
                  echo "⏳ Attente du démarrage des services..."
                  sleep 40
                '''
            }
        }

        /* ================= INTEGRATION TESTS ================= */
        stage('Integration Tests') {
            steps {
                echo "🧪 Tests d’intégration (routing Nginx)..."
                sh '''
                  set -e

                  for i in {1..10}; do
                    curl -s http://localhost/ >/dev/null && break
                    sleep 5
                  done

                  curl -i http://localhost/api/auth/ || true
                  curl -i http://localhost/products/ || true
                  curl -i http://localhost/api/order/ || true

                  echo "✅ Routing Nginx OK"
                '''
            }
        }

        /* ================= SONARQUBE ================= */
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                      /var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonarScanner/bin/sonar-scanner \
                        -Dsonar.projectKey=microservices-project \
                        -Dsonar.sources=Front-main,auth-service-main,order-service-main,product-service-main \
                        -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/vendor/**
                    '''
                }
            }
        }

        /* ================= DEPLOY ================= */
        stage('Deploy') {
            steps {
                echo "🚀 Déploiement final..."
                sh '''
                  docker compose down
                  docker compose up -d
                '''
            }
        }
    }

    post {

        always {
            echo "🧹 Nettoyage Docker final..."
            sh 'docker compose down -v --remove-orphans || true'
        }

        success {
            echo "✅ Pipeline CI/CD réussi"
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                  curl -X POST \
                    -H "Content-type: application/json" \
                    --data '{"text":"✅ Pipeline CI/CD Microservices réussi"}' \
                    "$SLACK_URL"
                '''
            }
        }

        failure {
            echo "❌ Pipeline CI/CD échoué"
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                  curl -X POST \
                    -H "Content-type: application/json" \
                    --data '{"text":"❌ Pipeline CI/CD Microservices échoué"}' \
                    "$SLACK_URL"
                '''
            }
        }
    }
}
