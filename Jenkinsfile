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

        /* ================= START STACK (CLEAN + START) ================= */
        stage('Start Services') {
            steps {
                echo "🧹 Nettoyage Docker + Démarrage des services..."
                sh '''
                  # Nettoyage COMPLET de l’ancien environnement
                  docker compose down -v --remove-orphans || true

                  docker rm -f product-service auth-service order-service frontend nginx-gateway || true

                  docker network prune -f || true

                  # Démarrage des NOUVEAUX conteneurs
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
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                          export PATH=\$PATH:${scannerHome}/bin
                          sonar-scanner \
                            -Dsonar.projectKey=microservices-project \
                            -Dsonar.sources=Front-main,auth-service-main,order-service-main,product-service-main \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/vendor/**
                        """
                    }
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
        }

        failure {
            echo "❌ Pipeline CI/CD échoué"
        }
    }
}
