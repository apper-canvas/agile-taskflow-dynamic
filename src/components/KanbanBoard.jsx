import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import TaskCard from './TaskCard'
import ApperIcon from './ApperIcon'

const KanbanBoard = ({ 
  tasks, 
  projects, 
  onEditTask, 
  onDeleteTask, 
  onUpdateTaskStatus 
}) => {
  const [draggedTask, setDraggedTask] = useState(null)

  const columns = [
    { id: 'pending', title: 'To Do', status: 'pending', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'Circle' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: 'Clock' },
    { id: 'completed', title: 'Done', status: 'completed', color: 'text-green-600', bgColor: 'bg-green-50', icon: 'CheckCircle2' }
  ]

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (start) => {
    const task = tasks.find(t => t.id === start.draggableId)
    setDraggedTask(task)
  }

  const handleDragEnd = (result) => {
    setDraggedTask(null)
    
    if (!result.destination) {
      return
    }

    const { draggableId, destination } = result
    const newStatus = destination.droppableId

    // Find the task and update its status
    const task = tasks.find(t => t.id === draggableId)
    if (task && task.status !== newStatus) {
      onUpdateTaskStatus(draggableId, newStatus)
    }
  }

  return (
    <div className="h-full">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status)
            
            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className={`kanban-header ${column.bgColor} dark:${column.bgColor.replace('bg-', 'bg-opacity-20 bg-')}`}>
                  <div className="flex items-center gap-2">
                    <ApperIcon name={column.icon} className={`w-5 h-5 ${column.color}`} />
                    <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
                    <span className="bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-2 py-1 rounded-full text-xs font-medium">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Body */}
                <Droppable droppableId={column.status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column kanban-body flex-1 ${
                        snapshot.isDraggingOver ? 'drag-over' : ''
                      }`}
                    >
                      {columnTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                          <ApperIcon 
                            name={column.icon} 
                            className={`w-12 h-12 ${column.color} opacity-30 mb-2`} 
                          />
                          <p className="text-surface-500 dark:text-surface-400 text-sm">
                            No tasks in {column.title.toLowerCase()}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {columnTasks.map((task, index) => {
                            const project = projects.find(p => p.id === task.projectId)
                            
                            return (
                              <Draggable 
                                key={task.id} 
                                draggableId={task.id} 
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={snapshot.isDragging ? 'dragging' : ''}
                                  >
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                      <TaskCard
                                        task={task}
                                        project={project}
                                        onEdit={onEditTask}
                                        onDelete={onDeleteTask}
                                        onStatusChange={onUpdateTaskStatus}
                                        className={snapshot.isDragging ? 'shadow-2xl' : ''}
                                      />
                                    </motion.div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* Drag Preview */}
      {draggedTask && (
        <div className="fixed pointer-events-none z-50 opacity-80">
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-2xl border border-surface-200 dark:border-surface-600 p-3 transform rotate-3">
            <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
              {draggedTask.title}
            </h4>
          </div>
        </div>
      )}
    </div>
  )
}

export default KanbanBoard