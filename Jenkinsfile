pipeline {
    agent {
        docker {
            image 'node:8-alpine'
            args '-u 0:0' // set user to root
        }
    }
    environment {
      CI = 'true'
    }
    stages {
        stage('check') {
            steps {
                echo 'Building..'
                sh "npm --version"
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                sh "npm install"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                sh "npm run test"
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
