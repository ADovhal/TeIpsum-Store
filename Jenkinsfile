import groovy.json.JsonOutput

pipeline {
    agent any

    environment {
        API_URL = credentials('api_url')
        GITHUB_TOKEN = credentials('github_token')
        REACT_APP_API_URL = credentials('react_app_api_url')
        DOMAIN_NAME = credentials('domain_name')

    }

    stages {
        stage('Create .env File') {
            steps {
                script {
                    echo 'Creating .env file...'
                    // Создаём файл .env с несколькими переменными окружения
                    def envContent = """
                    DOMAIN_NAME=${DOMAIN_NAME}
                    API_URL=${API_URL}
                    """
                    writeFile file: '.env', text: envContent.stripIndent()
                }
            }
        }

        stage('Build and Run') {
            steps {
                script {
                    echo 'Deploy to Test Server'
                    echo 'Starting Docker Compose...'
                    sh 'docker --version'
                    sh 'docker-compose --version'
                    sh 'docker-compose up --build -d'
                }
            }
        }

        stage('Run Tests with Newman') {
            steps {
                script {
                    echo 'Running tests with Newman...'
                    sh 'newman -v'
                    echo "Using API URL: " //$API_URL
                    
                    // Запуск тестов с использованием API_URL
                    sh ('newman run $API_URL --reporters cli,allure --reporter-allure-export ./allure-results-frontend')

                    //error("Force failure for testing purposes")
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    echo 'Generating Allure report...'
                    sh 'allure --version'
                    sh 'allure generate ./allure-results-frontend -o ./allure-report-frontend --clean'
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
                script {
                    echo 'Publishing Allure report...'
                    allure([
                        results: [[path: './allure-results-frontend']]
                    ])
                }
            }
        }
    }

    post {
        always {
            script {
                // echo 'Cleaning up...'
                // sh 'docker-compose down'

                echo 'Trying to save current version available for testers.'
                echo 'Test deliverables will help to decide when to make Pull Request to main branch.'
            }
        }

        success {
            script {
                echo 'Build succeeded!'
                def commitStatusUrl = "https://api.github.com/repos/ADovhal/WebShopOnline/statuses/${env.GIT_COMMIT}"

                def body = JsonOutput.toJson([
                    state: 'success',
                    target_url: env.BUILD_URL,
                    description: "Build succeeded",
                    context: "continuous-integration/jenkins"
                ])

                writeFile file: 'body.json', text: body
                
                sh("""
                    curl -X POST -H "Authorization: token \$GITHUB_TOKEN" -H "Content-Type: application/json" \
                    -d @body.json ${commitStatusUrl}
                """)
            }
        }

        failure {
            script {
                echo 'Build failed!'

                def commitStatusUrl = "https://api.github.com/repos/ADovhal/WebShopOnline/statuses/${env.GIT_COMMIT}"

                def body = JsonOutput.toJson([
                    state: 'failure',
                    target_url: env.BUILD_URL,
                    description: "Build failed",
                    context: "continuous-integration/jenkins"
                ])

                writeFile file: 'body.json', text: body
                
                sh("""
                    curl -X POST -H "Authorization: token \$GITHUB_TOKEN" -H "Content-Type: application/json" \
                    -d @body.json ${commitStatusUrl}
                """)
            }
        }
    }
}
