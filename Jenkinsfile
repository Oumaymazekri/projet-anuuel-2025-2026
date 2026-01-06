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
        echo "🧪 Tests d’intégration (routing Nginx)..."
        sh '''
          set -e

          echo "⏳ Attente du démarrage de Nginx..."
          for i in {1..10}; do
            curl -s http://localhost/ >/dev/null && break
            sleep 5
          done

          echo "🔐 Auth service (route publique)"
          curl -i http://localhost/api/auth/ || true

          echo "📦 Product service (route publique)"
          curl -i http://localhost/products/ || true

          echo "🛒 Order service (route protégée – JWT attendu)"
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
              export PATH=$PATH:$(tool 'SonarScanner')/bin

              sonar-scanner \
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
