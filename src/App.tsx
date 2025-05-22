import KanbanBoard from './components/KanbanBoard'
import './App.css'


function App() {

  
  return (
    <div >
      <h1 className='text-5xl font-bold mb-4'>To do App With Kanban Columns</h1>
      <div>
        <KanbanBoard /> 
      </div>
    </div>
  )
}

export default App
