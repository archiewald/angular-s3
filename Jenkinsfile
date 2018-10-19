pipeline {
    agent {
        docker {
            image 'node:8-alpine'
            args '-u 0:0'
        }
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
                sh "ng test — single-run true"
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
