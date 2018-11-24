pipeline {
    agent {
        docker {
            image 'avatsaev/angular-chrome-headless'
            args '-u 0:0 --entrypoint=""' // set user to root
        }
    }
    environment {
      CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh "npm install"
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Unit testing..'
                sh "npm run test:ci"
            }
        }
        stage('e2e Tests') {
            steps {
                echo 'e2e testing..'
                sh "npm run e2e"
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....TODO'
            }
        }
    }
}
