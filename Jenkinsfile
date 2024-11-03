import groovy.json.JsonOutput

pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('github_token')
        REACT_APP_API_URL_TEST = credentials('react_app_api_url_test_env')
        DOMAIN_NAME = credentials('domain_name')
        GIT_COMMIT_MAIN_REPO = credentials('git_commit_main_repo')
        DB_URL = credentials('test_db_url')
        DB_USER = 'postgres'
        DB_PASSWORD = 'admin'
        JWT_SECRET = 'jwt_secret'
        CORS_ALLOWED_ORIGINS = credentials('cors_allowed_origins_test_env')
    }

    stages {
        stage('Stop Old Containers') {
            steps {
                script {
                    def containers = ["test_env_test_frontend_1", "test_env_test_backend_1"]
                    containers.each { container ->
                        sh """
                            if [ \$(docker ps -a -q -f name=${container}) ]; then
                                docker stop ${container} || true
                                docker rm ${container} || true
                            else
                                echo "Container ${container} does not exist, skipping..."
                            fi
                        """
                    } 
                    // sh 'docker-compose -f docker-compose.dev.yml down'
                }
            }
        }

        stage('Create .env File') {
            steps {
                script {
                    echo 'Creating .env file...'
                    
                    def envContent = """
                    REACT_APP_API_URL_TEST=${REACT_APP_API_URL_TEST}
                    DOMAIN_NAME=app.${DOMAIN_NAME}
                    DB_URL=${DB_URL}
                    DB_USER=${DB_USER}
                    DB_PASSWORD=${DB_PASSWORD}
                    JWT_SECRET=${JWT_SECRET}
                    CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
                    """

                    writeFile file: 'frontend/webform/.env', text: envContent.stripIndent()
                }
            }
        }
        
        stage('Build and Run') {
            steps {
                script {
                    echo 'Deploy to Test Server'
                    echo 'Using updated docker-compose for test environment!'
                    echo 'Starting Docker Compose...'
                    sh 'docker --version'
                    sh 'docker-compose --version'
                    sh 'docker-compose --env-file ./frontend/webform/.env -f docker-compose.dev.yml up -d --build'
                }
                
            }
        }

        stage('Run Tests') {
            steps {
                script {

                    echo 'Example of tests in Test Env.'
                    // echo 'Running tests with Newman...'
                    // sh 'newman -v'
                    // echo "Using API URL: " //$API_URL
                    
                    // // Запуск тестов с использованием API_URL
                    // sh ('newman run $API_URL --reporters cli,allure --reporter-allure-export ./allure-results-frontend')

                    // //error("Force failure for testing purposes")
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    echo 'Generating Allure report...'
                    // sh 'allure --version'
                    // sh 'allure generate ./allure-results-frontend -o ./allure-report-frontend --clean'
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
                def commitStatusUrl = env.GIT_COMMIT_MAIN_REPO + env.GIT_COMMIT

                def body = JsonOutput.toJson([
                    state: 'success',
                    target_url: env.BUILD_URL,
                    description: "Build succeeded",
                    context: "continuous-integration/jenkins"
                ])

                writeFile file: 'body.json', text: body
                
                sh("""
                    curl -X POST -H "Authorization: token \${GITHUB_TOKEN}" -H "Content-Type: application/json" \
                    -d @body.json ${commitStatusUrl}
                """)
            }
        }

        failure {
            script {
                echo 'Build failed!'

                def commitStatusUrl = env.GIT_COMMIT_MAIN_REPO + env.GIT_COMMIT

                def body = JsonOutput.toJson([
                    state: 'failure',
                    target_url: env.BUILD_URL,
                    description: "Build failed",
                    context: "continuous-integration/jenkins"
                ])

                writeFile file: 'body.json', text: body
                
                sh("""
                    curl -X POST -H "Authorization: token \${GITHUB_TOKEN}" -H "Content-Type: application/json" \
                    -d @body.json ${commitStatusUrl}
                """)
            }
        }
    }
}
