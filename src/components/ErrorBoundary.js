
import React, { Component } from 'react';



class ErrorBoundary extends Component {

    constructor(props) {
        console.log("erro boundary")
        super(props)
        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }

    }


    render() {
        if (this.state.hasError) {

            return <h1> Something is wrong </h1>
        }
        return this.props.children


    }
}
export default ErrorBoundary;