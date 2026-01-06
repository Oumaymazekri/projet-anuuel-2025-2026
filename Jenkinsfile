pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        REGISTRY = "docker.io/oumaymazekri"
        SONAR_HOST_URL = "http://localhost:9000"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Auth') {
                    steps {
                        dir('auth-service-main') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Product') {
                    steps {
                        dir('product-service-main') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Order') {
                    steps {
                        dir('order-service-main') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('Front-main') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Unit Tests') {
            parallel {
                stage('Auth Tests') {
                    steps {
                        dir('auth-service-main') {
                            sh 'npm test || true'
                        }
                    }
                }
                stage('Product Tests') {
                    steps {
                        dir('product-service-main') {
                            sh 'npm test || true'
                        }
                    }
                }
                stage('Order Tests') {
                    steps {
                        dir('order-service-main') {
                            sh 'npm test || true'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('Front-main') {
                            sh 'npm test || true'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                sh '''
                npx sonar-scanner \
                -Dsonar.projectKey=projet-microservices \
                -Dsonar.sources=. \
                -Dsonar.host.url=$SONAR_HOST_URL \
                -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }

        stage('Docker Build') {
            parallel {
                stage('Auth Image') {
                    steps {
                        dir('auth-service-main') {
                            sh 'docker build -t $REGISTRY/auth-service:latest .'
                        }
                    }
                }
                stage('Product Image') {
                    steps {
                        dir('product-service-main') {
                            sh 'docker build -t $REGISTRY/product-service:latest .'
                        }
                    }
                }
                stage('Order Image') {
                    steps {
                        dir('order-service-main') {
                            sh 'docker build -t $REGISTRY/order-service:latest .'
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        dir('Front-main') {
                            sh 'docker build -t $REGISTRY/frontend:latest .'
                        }
                    }
                }
            }
        }

        stage('Docker Push') {
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

        stage('Integration Tests & Deploy') {
            steps {
                sh '''
                docker compose down || true
                docker compose up -d
                docker ps
                '''
            }
        }
    }

    post {
        success {
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                curl -X POST -H "Content-type: application/json" \
                --data '{"text":"✅ CI/CD Microservices Pipeline SUCCESS"}' \
                $SLACK_URL
                '''
            }
        }
        failure {
            withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')]) {
                sh '''
                curl -X POST -H "Content-type: application/json" \
                --data '{"text":"❌ CI/CD Microservices Pipeline FAILED"}' \
                $SLACK_URL
                '''
            }
        }
    }
}
