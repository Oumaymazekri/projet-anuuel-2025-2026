pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '1'

        SONAR_PROJECT_KEY = 'microservices-project'
        SONAR_HOST_URL = 'http://localhost:9000'

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

        /* ================= START STACK ================= */
        stage('Start Services') {
            steps {
                echo "🚀 Démarrage des services..."
                sh '''
                  docker compose up -d
                  echo "⏳ Attente des services..."
                  sleep 40
                '''
            }
        }

        /* ================= INTEGRATION TESTS ================= */
        stage('Integration Tests') {
            steps {
                echo "🧪 Tests d’intégration..."
                sh '''
                  set -e

                  for i in {1..10}; do
                    curl -f http://localhost && break
                    echo "⏳ Nginx pas encore prêt..."
                    sleep 5
                  done

                  curl -f http://localhost/auth
                  curl -f http://localhost/products
                  curl -f http://localhost/orders
                '''
            }
        }

        /* ================= SONARQUBE ================= */
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                      sonar-scanner \
                      -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                      -Dsonar.host.url=$SONAR_HOST_URL \
                      -Dsonar.login=$SONAR_TOKEN \
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
        success {
            echo "✅ Pipeline CI/CD réussi"
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                  curl -X POST -H "Content-type: application/json" \
                  --data '{"text":"✅ Pipeline CI/CD Microservices réussi"}' \
                  $SLACK_URL
                '''
            }
        }

        failure {
            echo "❌ Pipeline CI/CD échoué"
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                  curl -X POST -H "Content-type: application/json" \
                  --data '{"text":"❌ Pipeline CI/CD Microservices échoué"}' \
                  $SLACK_URL
                '''
            }
        }

        always {
            echo "🧹 Nettoyage Docker..."
            sh 'docker compose down || true'
        }
    }
}
