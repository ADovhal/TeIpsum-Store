pipeline {
    agent any

    environment {
        API_URL = credentials('api_url') // Замените 'api_url' на ID вашего секрета
        // BACKEND_API_URL = credentials('backend_api')
        // BACKEND_API_URL = credentials('web_backend_api')
    }

    stages {
        stage('Build and Run') {
            steps {
                script {
                    echo 'Starting Docker Compose...'
                    // Проверка установленных версий
                    sh 'docker --version'
                    sh 'docker-compose --version'
                    
                    // Запуск сервисов в фоновом режиме
                    sh 'docker-compose up --build -d' 
                }
            }
        }

        stage('Run Tests with Newman') {
            steps {
                script {
                    echo 'Running tests with Newman...'
                    // Убедитесь, что Newman установлен
                    sh 'newman -v'

                    // Вывод используемого URL для проверки
                    echo "Using API URL: ${API_URL}"

                    // Запуск тестов с выводом в формат Allure, используя catchError
                    // catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        sh "newman run ${API_URL} --reporters cli,allure --reporter-allure-export ./allure-results-frontend"
                        // sh "newman run ${BACKEND_API_URL} --reporters cli,allure --reporter-allure-export ./allure-results-backend"
                    // }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    echo 'Generating Allure report V2...'
                    // Проверка установленной версии Allure
                    sh 'allure --version'

                    // Генерация отчета Allure
                    sh 'allure generate ./allure-results-frontend -o ./allure-report-frontend --clean' // Создание статического отчета
                    // sh 'allure generate ./allure-results-backend -o ./allure-report-backend --clean' // Создание статического отчета
                }
            }
        }

        stage('Publish Allure Report') {
            steps {
                script {
                    echo 'Publishing Allure report...'
                    // Публикация отчета Allure в Jenkins 
                    allure([
                        results: [[path: './allure-results-frontend']] // [, [path: './allure-results-backend']]
                    ])
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Остановка и удаление контейнеров
            sh 'docker-compose down'
        }
    }
}
