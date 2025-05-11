import { demoSchema } from './demoSchema'
import './index.css'
import { Voyager } from './lib/components/Voyager'

function App() {
  return (
    <div class="app-container">
      <header class="app-header">
        <h1>GraphQL Voyager Lite</h1>
        <p>A lightweight GraphQL schema visualization tool</p>
      </header>
      
      <main class="app-content">
        {/* Render the Voyager component with our demo schema */}
        <Voyager 
          introspection={demoSchema} 
          displayOptions={{
            rootType: "Query",
            skipRelay: false,
            skipDeprecated: false,
            sortByAlphabet: true,
            showLeafFields: true,
            hideRoot: false
          }}
        />
      </main>
      
      <footer class="app-footer">
        <p>GraphQL Voyager Lite - v0.1.0</p>
      </footer>
    </div>
  )
}

export default App
