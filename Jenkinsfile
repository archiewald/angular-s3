pipeline {
    agent {
        docker {
            image 'zenika/alpine-chrome:with-node'
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
                echo 'Testing..'
                sh "npm run test:ci"
            }
        }
        stage('e2e Tests') {
            steps {
                echo 'Testing..'
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
