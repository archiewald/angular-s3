pipeline {
    agent {
        docker { image 'node:7-alpine' }
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
