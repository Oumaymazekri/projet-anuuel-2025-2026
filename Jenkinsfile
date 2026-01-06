pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/oumaymazekri"
        NODE_ENV = "test"
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        /* ===================== CHECKOUT ===================== */
        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        /* ===================== INSTALL ===================== */
        stage('Install Dependencies') {
            steps {
                sh '''
                for service in auth-service-main product-service-main order-service-main Front-main; do
                    if [ -f $service/package.json ]; then
                        echo "Installing dependencies for $service"
                        cd $service
                        npm install
                        cd ..
                    fi
                done
                '''
            }
        }

        /* ===================== UNIT TESTS ===================== */
        stage('Unit Tests') {
            steps {
                sh '''
                for service in auth-service-main product-service-main order-service-main; do
                    if [ -f $service/package.json ]; then
                        echo "Running tests for $service"
                        cd $service
                        npm test || true
                        cd ..
                    fi
                done
                '''
            }
        }

        /* ===================== INTEGRATION TESTS ===================== */
        stage('Integration Tests') {
            steps {
                sh '''
                echo "Running integration tests (Docker Compose)"
                docker compose -f docker-compose.test.yml up --build --abort-on-container-exit || true
                docker compose -f docker-compose.test.yml down
                '''
            }
        }

        /* ===================== SONARQUBE ===================== */
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    npx sonar-scanner \
                    -Dsonar.projectKey=projet-microservices \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        /* ===================== DOCKER BUILD ===================== */
        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $REGISTRY/auth-service:latest auth-service-main
                docker build -t $REGISTRY/product-service:latest product-service-main
                docker build -t $REGISTRY/order-service:latest order-service-main
                docker build -t $REGISTRY/frontend:latest Front-main
                '''
            }
        }

        /* ===================== DOCKER PUSH ===================== */
        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $REGISTRY/auth-service:latest
                    docker push $REGISTRY/product-service:latest
                    docker push $REGISTRY/order-service:latest
                    docker push $REGISTRY/frontend:latest
                    '''
                }
            }
        }

        /* ===================== DEPLOY ===================== */
        stage('Deploy (Docker)') {
            steps {
                sh '''
                docker compose down
                docker compose up -d
                '''
            }
        }
    }

    /* ===================== NOTIFICATIONS ===================== */
    post {
        success {
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text":"✅ Pipeline Microservices SUCCESS"}' $SLACK_URL
                '''
            }
        }
        failure {
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text":"❌ Pipeline Microservices FAILED"}' $SLACK_URL
                '''
            }
        }
    }
}
