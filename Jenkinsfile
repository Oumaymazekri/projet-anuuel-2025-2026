pipeline {
    agent any

    environment {
        // Docker
        DOCKER_BUILDKIT = '1'

        // SonarQube
        SONAR_PROJECT_KEY = 'microservices-project'
        SONAR_HOST_URL = 'http://localhost:9000'

        // Credentials Jenkins
        SONAR_TOKEN = credentials('sonartoken')
        SLACK_URL = credentials('slack-webhook')

        // Docker Compose
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

        /* ================= BUILD IMAGES ================= */
        stage('Build Docker Images') {
            steps {
                echo "🐳 Build des images Docker..."
                sh '''
                  docker compose build
                '''
            }
        }

        /* ================= INTEGRATION TESTS ================= */
        stage('Integration Tests (Docker Compose)') {
            steps {
                echo "🧪 Lancement des tests d’intégration..."
                sh '''
                  docker compose up -d
                  echo "⏳ Attente du démarrage des services..."
                  sleep 30

                  echo "🔍 Vérification des conteneurs..."
                  docker ps

                  echo "🧪 Tests d’intégration basiques (health check)"
                  curl -f http://localhost || exit 1
                  curl -f http://localhost/auth || exit 1
                  curl -f http://localhost/products || exit 1
                  curl -f http://localhost/orders || exit 1
                '''
            }
        }

        /* ================= SONARQUBE ================= */
        stage('SonarQube Analysis') {
            steps {
                echo "📊 Analyse SonarQube..."
                withSonarQubeEnv('SonarQube') {
                    sh '''
                      sonar-scanner \
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }

        /* ================= DEPLOY ================= */
        stage('Deploy (Docker)') {
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
            echo "✅ Pipeline terminé avec succès"
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                  curl -X POST -H "Content-type: application/json" \
                  --data '{"text":"✅ Pipeline CI/CD Microservices réussi"}' \
                  $SLACK_URL
                '''
            }
        }

        failure {
            echo "❌ Pipeline échoué"
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
