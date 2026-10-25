// Entry point. Guard catches any render error and offers a restart instead of a blank screen.
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

class Guard extends React.Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err) { console.error(err) }
  render() {
    if (!this.state.err) return this.props.children
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: '#E6EBF0', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <button onClick={() => this.setState({ err: null })} style={{ font: 'inherit', fontWeight: 700, fontSize: 18, padding: '14px 26px', borderRadius: 14, border: 0, background: '#2F6FAE', color: '#fff', cursor: 'pointer' }}>Restart story</button>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(<Guard><App /></Guard>)
