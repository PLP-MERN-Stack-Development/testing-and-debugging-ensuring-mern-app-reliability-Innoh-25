import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // this.logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="error-boundary"
          style={{
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid #e74c3c',
            borderRadius: '8px',
            margin: '2rem',
            backgroundColor: '#fdf2f2',
          }}
        >
          <h2>Something went wrong.</h2>
          <p>We apologize for the inconvenience. Please try refreshing the page.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ textAlign: 'left', margin: '1rem 0' }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{ 
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                marginRight: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;